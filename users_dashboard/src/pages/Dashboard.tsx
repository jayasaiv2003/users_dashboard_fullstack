import { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mantine/core";
import classes from "../css_file/TableSort.module.css";

interface RowData {
  name: string;
  email: string;
  company: string; 
  phone: string;
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
    Object.values(item).some((value) => value.toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) =>
      payload.reversed
        ? b[sortBy].localeCompare(a[sortBy])
        : a[sortBy].localeCompare(b[sortBy])
    ),
    payload.search
  );
}

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const formattedData: RowData[] = response.data.map((user: any) => ({
          name: user.name,
          email: user.email,
          company: user.company.name,
          phone: user.phone,
        }));
        setSortedData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(sortedData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.company}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th sorted={sortBy === "name"} reversed={reverseSortDirection} onSort={() => setSorting("name")}>
              Name
            </Th>
            <Th sorted={sortBy === "email"} reversed={reverseSortDirection} onSort={() => setSorting("email")}>
              Email
            </Th>
            <Th sorted={sortBy === "company"} reversed={reverseSortDirection} onSort={() => setSorting("company")}>
              Company
            </Th>
            <Th sorted={sortBy === "phone"} reversed={reverseSortDirection} onSort={() => setSorting("phone")}>
              Phone
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
