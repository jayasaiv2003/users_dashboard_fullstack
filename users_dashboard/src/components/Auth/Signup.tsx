import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Stack,
  Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../../hooks/useAuth';
import { IconX } from '@tabler/icons-react';
 import { useNavigate } from 'react-router-dom';
interface SignupProps {
  onToggleMode: () => void;
}


//const Signup: React.FC<SignupProps> = ({ onToggleMode }) => {
export default function Signup({onToggleMode}:SignupProps){
  const { signup, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate= useNavigate();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.trim().length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      setError('');
      await signup(values.email, values.password, values.name);
      navigate("/dashboard");
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" style={{ color: 'var(--mantine-color-blue-6)' }}>
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component="button" onClick={onToggleMode}>
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Notification 
            icon={<IconX size="1.1rem" />} 
            color="red" 
            title="Error"
            onClose={() => setError('')}
            mb="md"
          >
            {error}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Full Name"
              placeholder="Your name"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Create account
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

