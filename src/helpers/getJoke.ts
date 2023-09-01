import Swal from 'sweetalert2';

export function getJoke() {
    fetch("https://v2.jokeapi.dev/joke/Programming?lang=en")
        .then(response => response.json())
        .then(data => {
            if (data.type === "single") {
                Swal.fire({
                    text: data.joke,
                    icon: 'info',
                    confirmButtonText: '👏👏👏'
                });
            } else {
                Swal.fire({
                    text: `${data.setup}... ${data.delivery}`,
                    icon: 'info',
                    confirmButtonText: '👏👏👏'
                });
            }
        })
        .catch(error => {
            console.error("ERROR", error);
            Swal.fire({
                text: 'ERROR',
                icon: 'error',
                confirmButtonText: '😢'
            });
        });
}


