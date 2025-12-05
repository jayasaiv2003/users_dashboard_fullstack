import { useState, useEffect } from "react";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeAPI"
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Center,
  Group,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  ScrollArea,
  Button,
  Modal,
} from "@mantine/core";

import classes from "../css_file/TableSort.module.css";

interface RowData {
  id: number;
  name: string;
  email: string;
  salary: number;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) return filterData(data, payload.search);

  const sorted = [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return payload.reversed
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }

   
    return payload.reversed
      ? (bValue as number) - (aValue as number)
      : (aValue as number) - (bValue as number);
  });

  return filterData(sorted, payload.search);
}


export function Employee() {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [openedAdd, setOpenedAdd] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);

  const [editData, setEditData] = useState<RowData | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
  });

  const fetchData = () => {
    getEmployees()
      .then((res) => {
        const formatted = res.data.map((emp: any) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          salary: emp.salary,
        }));
        setSortedData(formatted);
      })
      .catch((err) => console.log("Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: any) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(sortedData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleAdd = async () => {
    await addEmployee({ ...form, salary: Number(form.salary) });
    setOpenedAdd(false);
    setForm({ name: "", email: "", salary: "" });
    fetchData();
  };

  const handleEdit = async () => {
    if (!editData) return;
    await updateEmployee(editData.id, {
      name: editData.name,
      email: editData.email,
      salary: editData.salary,
    });
    setOpenedEdit(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    fetchData();
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.salary}</Table.Td>

      <Table.Td>
        <Group>
          <Button
            size="xs"
            onClick={() => {
              setEditData(row);
              setOpenedEdit(true);
            }}
          >
            Edit
          </Button>

          <Button color="red" size="xs" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Search by any field"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Button onClick={() => setOpenedAdd(true)}>Add Employee</Button>
      </Group>

      <ScrollArea>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead>
            <Table.Tr>
              <Th sorted={sortBy === "name"} reversed={reverseSortDirection} onSort={() => setSorting("name")}>
                Name
              </Th>
              <Th sorted={sortBy === "email"} reversed={reverseSortDirection} onSort={() => setSorting("email")}>
                Email
              </Th>
              <Th sorted={sortBy === "salary"} reversed={reverseSortDirection} onSort={() => setSorting("salary")}>
                Salary
              </Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text ta="center">Nothing found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Add Employee Modal */}
      <Modal opened={openedAdd} onClose={() => setOpenedAdd(false)} title="Add Employee">
        <TextInput
          mb="sm"
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <TextInput
          mb="sm"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
        />
        <TextInput
          mb="sm"
          label="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.currentTarget.value })}
        />

        <Button fullWidth onClick={handleAdd}>
          Add
        </Button>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal opened={openedEdit} onClose={() => setOpenedEdit(false)} title="Edit Employee">
        {editData && (
          <>
            <TextInput
              mb="sm"
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.currentTarget.value })}
            />
            <TextInput
              mb="sm"
              label="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.currentTarget.value })}
            />
            <TextInput
              mb="sm"
              label="Salary"
              value={editData.salary}
              onChange={(e) =>
                setEditData({ ...editData, salary: Number(e.currentTarget.value) })
              }
            />

            <Button fullWidth onClick={handleEdit}>
              Save Changes
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
