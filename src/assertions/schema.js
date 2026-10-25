import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function assertMatchesSchema(data, schema) {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    const errors = (validate.errors ?? [])
      .map((e) => `  - ${e.instancePath || '(root)'} ${e.message}`)
      .join('\n');
    throw new Error(`Response does not match schema:\n${errors}\n\nActual:\n${JSON.stringify(data, null, 2)}`);
  }
}
