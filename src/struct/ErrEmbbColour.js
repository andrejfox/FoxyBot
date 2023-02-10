import { EmbedBuilder } from "discord.js";
import { config } from "../config/config.js";

export class errEmbbColour extends EmbedBuilder {
  constructor(user, data) {
    super(data);
    this.setColor(config.erorEmbedColour);
  }
}
