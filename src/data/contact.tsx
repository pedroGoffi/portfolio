import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { Contact } from "../types/contact";

export const contactMethods: Contact[] = [
  { icon: <FaGithub />,     label: "GitHub",    url: "https://github.com/pedroGoffi" },
  { icon: <FaLinkedin />,   label: "LinkedIn",  url: "https://www.linkedin.com/in/pedro-henrique-goffi-de-paulo-bb0426230/" },
  { icon: <SiWhatsapp />,   label: "Whatsapp",  url: "https://wa.me/5554997079061" },
];
