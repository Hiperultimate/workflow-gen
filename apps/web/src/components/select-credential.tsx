import { useQuery } from "@tanstack/react-query";
import { Select, Flex, Text } from "@radix-ui/themes";
import { getUserCredentials } from "@/api/getUserCredentials-get";
import type { ICredentials } from "@/types";

function SelectCredential({ onSelect }: { onSelect: (value : string) => void }) {
    const { data, isLoading, isError, error } = useQuery<{
      credentials: ICredentials[];
    }>({
      queryKey: ["credentials"],
      queryFn: getUserCredentials,
    });

  // Filter credentials based on search input
  const filteredCredentials =
    data?.credentials.filter(
      (credential) =>
        credential.title.toLowerCase() ||
        credential.platform.toLowerCase()
    ) || [];

  return (
    <Flex direction="column" gap="2">
      <Text className="font-bold">Select Credential</Text>
      <Select.Root
        size="2"
        onValueChange={(value) => onSelect(value)}
      >
        <Select.Trigger placeholder="Search credentials..." />
        <Select.Content>
          <Flex direction="column" gap="1" className="p-2">
            {isLoading && (
              <Text className="text-gray-500">Loading credentials...</Text>
            )}
            {isError && (
              <Text className="text-red-500">
                Error: {error?.message || "Failed to load credentials"}
              </Text>
            )}
            {!isLoading && !isError && filteredCredentials.length === 0 && (
              <Text className="text-gray-500">No credentials found</Text>
            )}
            {!isLoading && !isError && filteredCredentials.length > 0 && (
              <Select.Group>
                <Select.Label>Credentials</Select.Label>
                {filteredCredentials.map((credential) => (
                  <Select.Item key={credential.id} value={credential.id}>
                    {credential.title} ({credential.platform})
                  </Select.Item>
                ))}
              </Select.Group>
            )}
          </Flex>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

export default SelectCredential;
