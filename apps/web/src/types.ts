export enum Platforms {
    Email = "Email",
    Telegram = "Telegram"
}

export type ICredentials = {
  data : string,
  title: string,
  platform: Platforms
  id: string,
}