import {} from "https://deno.land/std@0.89.0/fmt/colors.ts";

export abstract class Message {
  text: string;
  color: string;
  time: Date;
}

export class NormalMessage implements Message {
  private color = "";
  private time: Date;
  constructor(private text: string) {
  }
}

export class SilentMessage implements Message {
  color: string;
  constructor(private text: string) {
  }
}

export class ShoutMessage implements Message {
  color: string;
  constructor(private text: string) {
  }
}
