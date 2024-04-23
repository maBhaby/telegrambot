type ENV = {
  TG_TOKEN: string
}

export const runtimeConfig = ((): ENV => ({
  TG_TOKEN: process.env.TG_TOKEN as string
}))()
