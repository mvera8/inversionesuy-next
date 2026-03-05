
import { Button, Container, Text } from '@mantine/core'
import tools from '@/data/tools'

export default async function Page() {

  return (
    <>
      <Container>
        <Text size="xl">Home</Text>

        <Button
          component="a"
          href="/dashboard"
        >
          Dashboard
        </Button>
        <Button
          component="a"
          href="/add-investment"
        >
          Add Investment
        </Button>
        <Button
          component="a"
          href="/login"
        >
          Login
        </Button>
        <Button
          component="a"
          href="/register"
        >
          Register
        </Button>




      </Container>

      <Container>



        {tools.map((tool) => (
          <Button
            key={tool.value}
            component="a"
            href={`/tools/${tool.value}`}
          >
            {tool.label}
          </Button>
        ))}

      </Container>

    </>
  )
}
