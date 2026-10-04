//¿Por qué una función? Porque en un sistema real no repetimos fetch(url) cada vez que necesitamos un dato. Lo ponemos en una función, y desde cualquier
// parte del programa la llamamos con un nombre. Si la URL de la API cambia algún día, solo cambias un lugar.

async function buscarPokemon(nombre) {

    const nombreMinusc = nombre.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nombreMinusc}`;

    //Llamar la API, se crea la url en caso tal de que se cambie el link de la API, solo se cambie allí en la variable URL
  const respuesta = await fetch(url);

  //Verificar si hubo un error (por ejemplo, si el pokemon no existe)
  if (!respuesta.ok) {
    console.log(`Error: No se encontró a "${nombre}". Status: ${respuesta.status}`);
    return null; // Retornamos null cuando falla
  }

  //Si todo salió bien, convertimos a JSON y retornamos
  const datos = await respuesta.json();
  return datos;
}

// Pruebas del Ejercicio 2
async function probarBuscar() {
  // Probamos con 3 Pokémon válidos
  const p1 = await buscarPokemon("pikachu");
  if (p1) console.log(`Encontrado: ${p1.name}, Peso: ${p1.weight}`);

  const p2 = await buscarPokemon("charizard");
  if (p2) console.log(`Encontrado: ${p2.name}, Peso: ${p2.weight}`);

  const p3 = await buscarPokemon("bulbasaur");
  if (p3) console.log(`Encontrado: ${p3.name}, Peso: ${p3.weight}`);

  // Probamos con un nombre que NO existe
  const pError = await buscarPokemon("pokemonQueNoExiste");
}

//probarBuscar(); 

//Mostrar los datos del pokemon
function mostrarFicha(datos) {
  //Si los datos vienen como null, avisamos y salimos
  if (!datos) {
    console.log("No hay información para mostrar.");
    return;
  }

  //Mostrar Nombre en mayúsculas e ID
  console.log(`====================================`);
  console.log(`POKÉMON: ${datos.name.toUpperCase()} (#${datos.id})`);
  console.log(`====================================`);

  //Obtener tipos y unirlos con "/"
  const listaTipos = [];
  for (let t of datos.types) {
    listaTipos.push(t.type.name);
  }
  console.log(`Tipos: ${listaTipos.join("/")}`);

  //Convertir altura (decímetros a cm) y peso (hectogramos a kg)
  const alturaCm = datos.height * 10;
  const pesoKg = datos.weight / 10;
  console.log(`Altura: ${alturaCm} cm | Peso: ${pesoKg} kg`);

  //Recorrer y mostrar estadísticas
  console.log("\nESTADÍSTICAS:");
  for (let s of datos.stats) {
    console.log(` - ${s.stat.name}: ${s.base_stat}`);
  }

  //Recorrer habilidades y validar si es oculta
  console.log("\nHABILIDADES:");
  for (let a of datos.abilities) {
    const esOculta = a.is_hidden ? " (oculta)" : "";
    console.log(` - ${a.ability.name}${esOculta}`);
  }
  console.log(`====================================\n`);
}

//Comparar Pokemon
function obtenerStat(datos, nombreStat) {
  for (let s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat; // Retorna el valor si lo encuentra
    }
  }
  return null; // Si no existe la stat
}

async function compararPokemon(nombre1, nombre2, stat) {
  // Buscar ambos Pokémones con await
  const p1 = await buscarPokemon(nombre1);
  const p2 = await buscarPokemon(nombre2);

  // Verificar si alguno no se encontró
  if (!p1 || !p2) {
    console.log("No se pudo realizar la comparación porque uno de los Pokémon no existe.");
    return;
  }

  // Obtener los valores de la stat deseada
  const valor1 = obtenerStat(p1, stat);
  const valor2 = obtenerStat(p2, stat);

  // Si la stat ingresada es inválida
  if (valor1 === null || valor2 === null) {
    console.log(`La estadística "${stat}" no es válida. Usar: hp, attack, defense, special-attack, special-defense o speed.`);
    return;
  }

  console.log(`--- COMPARACIÓN DE ${stat.toUpperCase()} ---`);
  console.log(`${p1.name}: ${valor1}`);
  console.log(`${p2.name}: ${valor2}`);

  // Comparar y mostrar ganador
  if (valor1 > valor2) {
    console.log(`Ganador ${p1.name.toUpperCase()}!`);
  } else if (valor2 > valor1) {
    console.log(`Ganador ${p2.name.toUpperCase()}!`);
  } else {
    console.log("Los pokemon son igual ¡Es un empate!");
  }
}

//Pokemon mas fuerte 
async function pokemonMasFuerte(listaNombres, stat) {
  let mejorNombre = "";
  let mejorValor = -1; // Inicializamos variable

  for (let nombre of listaNombres) {
    const pokemon = await buscarPokemon(nombre);
    
    // Si no existe, lo saltamos con 'continue'
    if (!pokemon) continue;

    const valorStat = obtenerStat(pokemon, stat);
    if (valorStat === null) continue;

    // Si encontramos una stat mayor, actualizamos a nuestro nuevo líder
    if (valorStat > mejorValor) {
      mejorValor = valorStat;
      mejorNombre = pokemon.name;
    }
  }

  if (mejorNombre !== "") {
    console.log(`El Pokémon más fuerte en "${stat}" es ${mejorNombre.toUpperCase()} con ${mejorValor} puntos.`);
    return mejorNombre;
  } else {
    console.log("No se pudo determinar un ganador.");
    return null;
  }
}

//Parte 5 desafio final 

async function desafioFinal() {
  // 1. Equipo de 6 pokémon
  const miEquipo = ["pikachu", "charizard", "blastoise", "gengar", "mewtwo", "snorlax"];

  console.log("\n=== DESAFÍO FINAL ===");

  // 2. Más fuerte en 'attack'
  
  const ganadorAtaque = await pokemonMasFuerte(miEquipo, "attack");

  // 3. Más fuerte en 'defense'
  await pokemonMasFuerte(miEquipo, "defense");

  // 4. Mostrar ficha completa del ganador en 'attack' usando mostrarFicha()
  if (ganadorAtaque) {
    console.log("\n--- FICHA DEL GANADOR DE ATAQUE ---");
    const datosGanador = await buscarPokemon(ganadorAtaque);
    mostrarFicha(datosGanador);
  }
}
desafioFinal();