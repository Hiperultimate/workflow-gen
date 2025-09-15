import { useQuery } from "@tanstack/react-query";
import { Select, Flex, Text } from "@radix-ui/themes";
import { getUserCredentials } from "@/api/getUserCredentials-get";
import type { ICredentials } from "@/types";
import { useCallback } from "react";

function SelectCredential({
  selectedCredential,
  onSelect,
}: {
  selectedCredential: ICredentials | null;
  onSelect: (value: ICredentials | null) => void;
}) {
  const { data, isLoading, isError, error } = useQuery<{
    credentials: ICredentials[];
  }>({
    queryKey: ["credentials"],
    queryFn: getUserCredentials,
  });

  const credentials = data?.credentials || [];

  const onSelectChange = useCallback(
    (id: string) => {
      if (!data) {
        console.log("Something went wrong while selecting credentials...");
        return;
      }
      const getCredentialData = data.credentials.find((item) => item.id === id);
      onSelect(getCredentialData || null);
    },
    [data, onSelect]
  );

  return (
    <Flex direction="column" gap="2">
      <Text className="font-bold">Select Credential</Text>
      <Select.Root
        size="2"
        onValueChange={onSelectChange}
        defaultValue={selectedCredential?.id}
        disabled={isLoading || isError}
      >
        <Select.Trigger
          placeholder={isLoading ? "Loading..." : "Select a credential"}
          aria-label="Select a credential"
        />
        <Select.Content position="popper" sideOffset={5} align="start">
          <Flex direction="column" gap="1" className="p-2">
            {isLoading && (
              <Text className="text-gray-500">Loading credentials...</Text>
            )}
            {isError && (
              <Text className="text-red-500">
                Error: {error?.message || "Failed to load credentials"}
              </Text>
            )}
            {!isLoading && !isError && credentials.length === 0 && (
              <Text className="text-gray-500">No credentials found</Text>
            )}
            {!isLoading && !isError && credentials.length > 0 && (
              <Select.Group>
                <Select.Label>Credentials</Select.Label>
                {credentials.map((credential) => (
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
