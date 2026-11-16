import { loadFont } from "@remotion/fonts";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/**
 * Carga las tipografias locales antes del primer fotograma.
 * Sin esto el texto se dibujaria con la fuente de respaldo y cambiaria
 * entre el preview y el render.
 */
const handle = delayRender("Cargando tipografias");

Promise.all([
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-Medium.ttf"),
    weight: "500",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-SemiBold.ttf"),
    weight: "600",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-ExtraBold.ttf"),
    weight: "800",
  }),
  loadFont({
    family: "JetBrainsMono",
    url: staticFile("fonts/JetBrainsMono-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "JetBrainsMono",
    url: staticFile("fonts/JetBrainsMono-Medium.ttf"),
    weight: "500",
  }),
])
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
