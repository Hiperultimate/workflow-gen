export function isValidObject(input: string):
  | {
      success: true;
      data: object;
    }
  | {
      success: false;
      data: null;
    }
{
  try {
    const parsed = JSON.parse(input);

    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, data: null };
  }
}
