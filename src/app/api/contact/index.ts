import { z } from 'zod';

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

console.log(bodySchema);


