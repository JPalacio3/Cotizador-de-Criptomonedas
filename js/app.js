const criptoMonedasSelect = document.querySelector( '#criptomonedas' );
const monedaSelect = document.querySelector( '#moneda' );
const formulario = document.querySelector( '#formulario' );

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
    console.log( cotizacion )
}
