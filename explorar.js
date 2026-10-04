//async-> le dice a JS que la tarea va a tomar algo de tiempo
async function explorar(){

    //await-> espera a que que la API regrese con la respuesta antes de contiuar
    //fetch-> llama la API
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/charizard");

    console.log("Status de la respuesta", respuesta.status);

    //JSON-> sirve para "destapar la API" y poder ver lo que hay (convierte el texto de la API en algo facil de leer)
    const datos = await respuesta.json();

        //Recorrer y mostrar TODOS los tipos
    console.log("\n--- EJERCICIO 1 ---");

    // 1. Recorrer y mostrar TODOS los tipos
    console.log("TIPOS:");

    //Usamos for porque no sabes cuantos elementos tiene un pokémon, por ejemplo Pikachu puede ser solo electrico
    // pero Charizard puede ser fuego y volador. el ciclo for se usa para que el programa revise cada uno de los elementos de la lista hasuq ese teminen
    //datos.types/types.name hacen parte deL arreglo de API de pokemon
    for (let t of datos.types) {
        console.log("- " + t.type.name); // Accedemos a la propiedad del tipo
    }

    // 2. Recorrer y mostrar TODAS las stats (estadísticas)
    console.log("\nESTADÍSTICAS:");
    for (let s of datos.stats) {
        console.log(`- ${s.stat.name}: ${s.base_stat}`);
    }

    // 3. Recorrer y mostrar TODAS las habilidades
    console.log("\nHABILIDADES:");
    for (let a of datos.abilities) {
        console.log("- " + a.ability.name);
    }
}

explorar();

    
