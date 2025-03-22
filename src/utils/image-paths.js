/** @format */

// UI and layout images
import title from "../../public/images/title.png";
import logo from "../../public/images/molly logo.png";
import sun from "../../public/images/sun.png";
import rope from "../../public/images/rope.png";
import mandala from "../../public/images/mandala.png";
import mandala_b from "../../public/images/mandala-b.png";
import title_2 from "../../public/images/title-2.png";
import mandala_rules from "../../public/images/mandala-rules.png";
import kokis from "../../public/images/kokis.png";
import pot_ideal from "../../public/images/pot.png";
import pot_broken from "../../public/images/broken pot.png";
import pot_broken_fluid from "../../public/images/broken pot with fluid.png";

// Import all color-specific pot images with fluid
import pot_fluid_red from "../../public/images/colors/broken_pot_red.png";
import pot_fluid_blue from "../../public/images/colors/broken_pot_blue.png";
import pot_fluid_green from "../../public/images/colors/broken_pot_green.png";
import pot_fluid_yellow from "../../public/images/colors/broken_pot_yellow.png";
import pot_fluid_purple from "../../public/images/colors/broken_pot_purple.png";
import pot_fluid_pink from "../../public/images/colors/broken_pot_pink.png";
import pot_fluid_orange from "../../public/images/colors/broken_pot_orange.png";
import pot_fluid_teal from "../../public/images/colors/broken_pot_teal.png";

// Import fluid images
import fluid_red from "../../public/images/fluid/fluid_red.png";
import fluid_blue from "../../public/images/fluid/fluid_blue.png";
import fluid_green from "../../public/images/fluid/fluid_green.png";
import fluid_yellow from "../../public/images/fluid/fluid_yellow.png";
import fluid_purple from "../../public/images/fluid/fluid_purple.png"; // This is the correct filename
import fluid_pink from "../../public/images/fluid/fluid_pink.png";
import fluid_orange from "../../public/images/fluid/fluid_orange.png";
import fluid_teal from "../../public/images/fluid/fluid_teal.png";

// Define colors used in your game
const colorNames = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "orange",
  "teal",
];

// Get all the game images directly - do NOT use .src property
export const getAllGameImages = () => {
  return [
    // UI images
    title.src,
    logo.src,
    sun.src,
    rope.src,
    mandala.src,
    mandala_b.src,
    title_2.src,
    mandala_rules.src,
    kokis.src,

    // Pot state images
    pot_ideal.src,
    pot_broken.src,
    pot_broken_fluid.src,

    // Color-specific pot images
    pot_fluid_red.src,
    pot_fluid_blue.src,
    pot_fluid_green.src,
    pot_fluid_yellow.src,
    pot_fluid_purple.src,
    pot_fluid_pink.src,
    pot_fluid_orange.src,
    pot_fluid_teal.src,

    // Fluid animation images
    fluid_red.src,
    fluid_blue.src,
    fluid_green.src,
    fluid_yellow.src,
    fluid_purple.src,
    fluid_pink.src,
    fluid_orange.src,
    fluid_teal.src,
  ];
};

export {
  title,
  logo,
  sun,
  rope,
  mandala,
  mandala_b,
  title_2,
  mandala_rules,
  kokis,
  pot_ideal,
  pot_broken,
  pot_broken_fluid,
  pot_fluid_red,
  pot_fluid_blue,
  pot_fluid_green,
  pot_fluid_yellow,
  pot_fluid_purple,
  pot_fluid_pink,
  pot_fluid_orange,
  pot_fluid_teal,
  fluid_red,
  fluid_blue,
  fluid_green,
  fluid_yellow,
  fluid_purple,
  fluid_pink,
  fluid_orange,
  fluid_teal,
};
