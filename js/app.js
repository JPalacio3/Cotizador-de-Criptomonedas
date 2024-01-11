const criptoMonedasSelect = document.querySelector( '#criptomonedas' );
const monedaSelect = document.querySelector( '#moneda' );
const formulario = document.querySelector( '#formulario' );
const resultado = document.querySelector( '#resultado' );

// Objeto con la información del formulario
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve( criptomonedas );
} );

document.addEventListener( 'DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener( 'submit', submitFormulario );
    criptoMonedasSelect.addEventListener( 'change', leerValor );
    monedaSelect.addEventListener( 'change', leerValor );
} );

function consultarCriptomonedas() {
    // Consulta a la API para obtener las monedas más importantes
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( resultado => obtenerCriptomonedas( resultado.Data ) )
        .then( criptomonedas => selectCriptomonedas( criptomonedas ) );
}

function selectCriptomonedas( criptomonedas ) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement( 'OPTION' );
        option.value = Name;
        option.textContent = FullName;
        criptoMonedasSelect.appendChild( option );
    } );
}

function leerValor( e ) {
    e.preventDefault();
    objBusqueda[ e.target.name ] = e.target.value;
}

function submitFormulario( e ) {
    e.preventDefault();

    // Validar
    const { moneda, criptomoneda } = objBusqueda;

    if ( moneda === '' || criptomoneda === '' ) {
        mostrarAlerta( 'Error! - Ambos Campos Son Obligatorios' );
        return;
    }

    // Consultar la API con los resultados
    consultarApi();
}

function mostrarAlerta( msg ) {
    const existeError = document.querySelector( '.error' );
    if ( !existeError ) {
        const divMensaje = document.createElement( 'DIV' );
        divMensaje.classList.add( 'error' );

        // Mensaje de error
        divMensaje.textContent = msg;
        formulario.appendChild( divMensaje );

        setTimeout( () => {
            divMensaje.remove();
        }, 2000 );
    }
}

function consultarApi() {
    const { moneda, criptomoneda } = objBusqueda;

    // Consulta a la API para obtener los valores de la moneda seleccionada en el formulario
    // const url = `https://min-api.cryptocompare.com/data/price?fsym=${criptomoneda}&tsyms=${moneda}`;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacionHTML( cotizacion.DISPLAY[ criptomoneda ][ moneda ] );
        } );
}

function mostrarCotizacionHTML( cotizacion ) {

    limpiarHTML();

    // Extraer los datos del objeto que se obtiene como respuesta
    const { PRICE, HIGHDAY, LOWHOUR, HIGHHOUR, LOWDAY, CHANGEPCT24HOUR, FROMSYMBOL, LASTUPDATE } = cotizacion;

    const precio = document.createElement( 'P' );
    precio.classList.add( 'precio' );
    precio.innerHTML = `Precio : <span> ${PRICE}</span>`;

    const precioAlto = document.createElement( 'P' );
    precioAlto.innerHTML = ` Precio más alto del día : <span>  ${HIGHDAY}  </span> `;

    const precioBajo = document.createElement( 'P' );
    precioBajo.innerHTML = ` Precio más bajo del día: <span>  ${LOWDAY} </span> `;

    const precioAltoHora = document.createElement( 'P' );
    precioAltoHora.innerHTML = ` Precio más alto de la última hora: <span>  ${HIGHHOUR} </span> `;

    const precioBajoHora = document.createElement( 'P' );
    precioBajoHora.innerHTML = ` Precio más bajo de la última hora: <span>  ${LOWHOUR} </span> `;

    const variacionHora = document.createElement( 'P' );
    variacionHora.innerHTML = `Variación en las últimas 24 horas: <span> ${CHANGEPCT24HOUR} %</span> `;

    const simbolo = document.createElement( 'P' );
    simbolo.innerHTML = `Símbolo que lo representa: <span>  ${FROMSYMBOL} </span> `;

    const actualizacion = document.createElement( 'P' );
    actualizacion.innerHTML = `Última actualización: <span>  ${LASTUPDATE} </span> `;

    // Imprimir en pantalla los resultados de la consulta
    resultado.appendChild( precio );
    resultado.appendChild( precioAlto );
    resultado.appendChild( precioBajo );
    resultado.appendChild( precioAltoHora );
    resultado.appendChild( precioBajoHora );
    resultado.appendChild( variacionHora );
    resultado.appendChild( simbolo );
    resultado.appendChild( actualizacion );
}

function limpiarHTML() {
    while ( resultado.firstChild ) {
        resultado.removeChild( resultado.firstChild );
    }
}



