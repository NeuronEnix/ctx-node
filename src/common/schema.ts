export const commonSchema = {
  uint32: { type: "number", minimum: 1, maximum: 2_147_483_647 },
  string: { type: "string" },
  bool: { type: "boolean" },
  stringBool: { type: "string", enum: ["true", "false"] },
  date: { type: "string", format: "date" },
  userId: { type: "string", minLength: 5, maxLength: 10 },
  nanoid: { type: "string", minLength: 10, maxLength: 21 },
  uuid: { type: "string", minLength: 36, maxLength: 36 },
  alphaNumeric: { type: "string", pattern: "^[a-zA-Z0-9]*$" },
};
