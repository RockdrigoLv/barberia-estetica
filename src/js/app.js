let pagina = 1;
const cita = {
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
  iniciarApp();

});


function iniciarApp() {
  mostrarServicios();
  //resalta el div actual
  mostrarSeccion();
  // oculta o muestra uuna seccion segun el tab al que se presiona
  cambiarSeccion();
  //paginacion siguiente y anterior
  paginaSiguiente();
  paginaAnterior();
  // comprueba la pagina actual para ocultar o mostrar la paginacion
  botonesPaginador();
  // muestra el Resumen del acita ( o mensaje de error en caso de no pasar la validacion)
  mostrarResumen();
  //almacena el nombre de la cita en el objeto
  nombreCita();
  // almacena la fecha de la cita en el objeto
  fechaCita();
  // deshabilita dias pasados
  deshabilitarFechaAnterior();
  //almacena la hora de la cita en el objeto
  horaCita();


}
// Mostrar seleccion
function mostrarSeccion() {
  //eliminar seccion anterior
  const seccionAnterior = document.querySelector('.mostrar-seccion');
  if (seccionAnterior) {

    seccionAnterior.classList.remove('mostrar-seccion');
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add('mostrar-seccion');

  //eliminar la clase de actual en el tab anterior
  const tabAnterior = document.querySelector('.tabs .actual');
  if (tabAnterior) {

    tabAnterior.classList.remove('actual');
  }

  //resalta seccion seccionActual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add('actual');


}
///cambiarseccion
function cambiarSeccion() {
  const enlaces = document.querySelectorAll('.tabs button');

  enlaces.forEach(enlace => {
    enlace.addEventListener('click', e => {

      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);
      //llamar la funcnion de mostrar seccion
      mostrarSeccion();
      botonesPaginador();

    });
  });

}


/////////////////////////////////////////////////////////// mostrar Servicios
async function mostrarServicios() {
  try {
    const resultado = await fetch('./servicios.json');
    const db = await resultado.json();
    const {
      servicios
    } = db;

    servicios.forEach(servicio => {
      const {
        id,
        nombre,
        precio
      } = servicio;
      // DOM scripting
      // nombre del servicio
      const nombreServicio = document.createElement('P');
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add('nombre-servicio');
      // precios del servicio
      const precioServicio = document.createElement('P');
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add('precio-servicio');
      // contenedor
      const servicioDiv = document.createElement('DIV');
      servicioDiv.classList.add('servicio');
      servicioDiv.dataset.idServicio = id;
      ///Selecciona un servicio para la Cita
      servicioDiv.onclick = seleccionarServicio;
      // insertar precio y nombre en el DIV
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      // agregar al html
      document.querySelector('#servicios').appendChild(servicioDiv);

    });


  } catch (e) {
    console.log(e);
  }

}
///////////////////////////////////////////////////////////////////////////
function seleccionarServicio(e) {
  // forzar que el elelmento al que le damos click sea el div
  let elemento;
  if (e.target.tagName === 'P') {
    elemento = e.target.parentElement;

  } else {
    elemento = e.target;
  }
  if (elemento.classList.contains('seleccionado')) {
    elemento.classList.remove('seleccionado');
    const id = parseInt(elemento.dataset.idServicio);
    eliminarServicio(id);
  } else {
    elemento.classList.add('seleccionado');

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent
    }
    // console.log(servicioObj);
    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const {
    servicios
  } = cita;
  cita.servicios = servicios.filter(servicio => servicio.id != id)

}

function agregarServicio(servicioObj) {
  const {
    servicios
  } = cita;
  cita.servicios = [...servicios, servicioObj];

}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', () => {
    pagina++;

    botonesPaginador();
  });
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', () => {
    pagina--;

    botonesPaginador();
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector('#siguiente');
  const paginaAnterior = document.querySelector('#anterior');
  if (pagina === 1) {
    paginaAnterior.classList.add('ocultar');

  } else if (pagina === 3) {
    paginaSiguiente.classList.add('ocultar');
    paginaAnterior.classList.remove('ocultar');
    mostrarResumen(); // vuelve  a cargar el resumen de la cita y
    // comprobar que los campos esten llenos
  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  }
  mostrarSeccion();
}

function mostrarResumen() {
  //destructuring
  const {
    nombre,
    fecha,
    hora,
    servicios
  } = cita;
  //seleccionar Resumen
  const resumenDiv = document.querySelector('.contenido-resumen');
  // limpiar vista resumen
  // resumenDiv.innerHTML = '';// froma lenta
  while (resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  } //forma rapida

  //validacion del objeto
  if (Object.values(cita).includes('')) {
    const noServicios = document.createElement('P');
    noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

    noServicios.classList.add('invalidar-cita');
    // agregar a resumen DIV
    resumenDiv.appendChild(noServicios);
    return; // evita la ejecucion del codigo si entro en esta condicion
  }
  const headingCita = document.createElement('H3');
  headingCita.textContent = 'Resumen de Cita';

  //mostrarResumen
  const nombreCita = document.createElement('P');
  nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
  // NOTE: innerHTML muestra texto pero respeta las etiquetas html que puedan estar conteniddas
  //textContent muestra todo el texto si restepetar etiquetas html
  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;


  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  const serviciosCita =document.createElement('DIV');
  serviciosCita.classList.add('resumen-servicio');

  const headingServicios = document.createElement('H3');
  headingServicios.textContent = 'Resumen de Servicios';
  serviciosCita.appendChild(headingServicios);

  let cantidad = 0;
// iterar sobre el arreglo de Servicios
  servicios.forEach(servicio =>{
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const textServicio = document.createElement('P');
    textServicio.textContent = servicio.nombre;
    const precioServicio = document.createElement('P');
    precioServicio.textContent = servicio.precio;
    precioServicio.classList.add('precio');

    const totalServicio = (servicio.precio).split('$');
    cantidad += parseInt(totalServicio[1].trim());

    // colocar texto y precio en el DIV
    contenedorServicio.appendChild(textServicio);
    contenedorServicio.appendChild(precioServicio);


    serviciosCita.appendChild(contenedorServicio);
  });
  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(serviciosCita);
  const cantidadPagar = document.createElement('P');
  cantidadPagar.classList.add('total');
  cantidadPagar.innerHTML =`<span> Total a Pagar: </span>$ ${cantidad}`;
  resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
  const nombreInput = document.querySelector('#nombre');
  nombreInput.addEventListener('input', e => {
    const nombreTexto = e.target.value.trim();
    // validacion de que nombre textContent
    if (nombreTexto === ' ' || nombreTexto.length < 3) {
      mostrarAlerta('nombre no valido', 'error');
    } else {
      const alerta = document.querySelector('.alerta');
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;

    }
  });
}

function mostrarAlerta(mensaje, tipo) {
  //si hay una alerta previa entonces no crear otra
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) {
    // alertaPrevia.remove();//Nota: va a estar eliminando cada nueva alerta
    // //con cada tecleado de datos
    return; //detiene la ejecucion si detecta una alertaPrevia
  }

  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  if (tipo === 'error') {
    alerta.classList.add('error');
  }
  const formulario = document.querySelector('.formulario');
  formulario.appendChild(alerta);
  setTimeout(() => {
    alerta.remove();
  }, 3000);

}

function fechaCita() {
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', e => {

    const dia = new Date(e.target.value).getUTCDay();
    if ([0, 6].includes(dia)) {
      e.preventDefault();
      fechaInput.value = '';
      mostrarAlerta('No hay citas en fines de semana', 'error');
    } else {
      cita.fecha = fechaInput.value;
      deshabilitarFechaAnterior(cita.fecha);
    }

  });
}

function deshabilitarFechaAnterior(fecha) {

  const inputFecha = document.querySelector('#fecha');
  const fechaAhora = new Date();

  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDate();

  //formato deseado: AAAA-MM-DD
  let fechaDeshabilitar;
  if (mes < 10 || dia < 10) {
    fechaDeshabilitar = `${year}-0${mes}-0${dia}`;
  } else {
    fechaDeshabilitar = `${year}-${mes}-${dia}`;
  }
  // inputFecha.setAttribute("min","");
  inputFecha.min = fechaDeshabilitar;

}

function horaCita() {
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', e => {

    const horaCita = e.target.value;
    const hora = horaCita.split(':');
    if (hora[0] < 10 || hora[0] > 18) {
      mostrarAlerta('Hora no valida', 'error');
      setTimeout(() => {
        inputHora.value = '';
      }, 2000);

    } else {

      cita.hora = horaCita;


    }
  });
}
