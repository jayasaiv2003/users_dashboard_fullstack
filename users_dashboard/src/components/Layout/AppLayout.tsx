import type { ReactNode } from 'react';
import { AppShell, Burger, Group, Button, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconDashboard, IconUsers, IconLogout } from '@tabler/icons-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: IconDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: IconUsers, label: 'Users', href: '/users' },
    { icon: IconUsers, label: 'Employees', href: '/employees' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <div>
              <strong>My App</strong>
            </div>
          </Group>
          <Group>
            <Text>Welcome, {user?.name}</Text>
            <Button variant="light" onClick={handleLogout} leftSection={<IconLogout size={16} />}>
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            leftSection={<item.icon size={16} />}
            active={location.pathname === item.href}
            onClick={() => navigate(item.href)}
            variant="filled"
            mb={5}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;