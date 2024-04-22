type ENV = {
  TOKEN: string
}

export const runtimeConfig = ((): ENV => ({
  TOKEN: process.env.TOKEN as string
}))()
