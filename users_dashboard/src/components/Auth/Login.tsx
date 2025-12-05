import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Flex,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";


interface LoginProps {
  onToggleMode: () => void;
}

export default function Login({ onToggleMode }: LoginProps) {
  const theme = useMantineTheme();
  const [error, setError] = useState("");
   const { login, isLoading } = useAuth();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError("");
      await login(values.email, values.password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Flex
      mih="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #f4e8ff 0%, #e3d1ff 100%)"
      p="lg"
    >
      <Flex
        w={{ base: "100%", sm: "90%", lg: "75%" }}
        bg="white"
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: theme.shadows.lg,
        }}
      >
        
        <Box w={{ base: "100%", md: "50%" }} p={{ base: "xl", md: "50px" }}>
          <Title ta="left" order={2} mb="xs" c="primary">
            LOGIN
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            get started
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              leftSection={<IconMail size={18} />}
              {...form.getInputProps("email")}
              mb="md"
              required
              onFocus={() => setError("")}
              onBlur={() => form.validateField("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size={18} />}
              {...form.getInputProps("password")}
              required
              onFocus={() => setError("")}
              onBlur={() => form.validateField("password")}
            />

            {error && (
              <Text size="sm" c="red" mt={5}>
                {error}
              </Text>
            )}

            <Button
              type="submit"
              mt="xl"
              fullWidth
              style={{ borderRadius: "12px" }}
            >
              Login Now
            </Button>
          </form>

          <Text size="sm" mt="md" ta="center">
            Don’t have an account?{" "}
            <Anchor component="button" onClick={onToggleMode}>
              Create account
            </Anchor>
          </Text>
        </Box>

       
        <Box
          w="50%"
          display={{ base: "none", md: "block" }}
          style={{
            background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src="/images/photo.png"
            alt="Login Illustration"
            style={{
              width: "75%",
              maxWidth: "350px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "20px",
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
