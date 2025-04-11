const API_KEY = 'live_uZca6SEZEM1f1puAiGxk1z2HoExsj2DR276Iq01Dl3sDuP5XWq55gOkITWM6';

document.addEventListener('DOMContentLoaded', () => {
    const breedsListElement = document.querySelector<HTMLUListElement>('#breeds');
    const breedListSection = document.querySelector<HTMLElement>('#breed-list');
    const breedDetailsSection = document.querySelector<HTMLElement>('#breed-details');
    const backButton = document.querySelector<HTMLButtonElement>('#back-button');
    const breedNameElement = document.querySelector<HTMLHeadingElement>('#breed-name');
    const breedTemperamentElement = document.querySelector<HTMLParagraphElement>('#breed-temperament');
    const carouselImage = document.querySelector<HTMLImageElement>('.carousel-image');
    const prevButton = document.querySelector<HTMLButtonElement>('.prev-button');
    const nextButton = document.querySelector<HTMLButtonElement>('.next-button');
    let currentImageIndex = 0;
    let breedImages: any[] = [];

    backButton?.addEventListener('click', () => {
        breedListSection?.classList.remove('hidden');
        breedDetailsSection?.classList.add('hidden');
    });

    prevButton?.addEventListener('click', showPreviousImage);
    nextButton?.addEventListener('click', showNextImage);

    fetchBreeds()
        .then(breeds => {
            breeds.forEach((breed: any) => {
                const li = document.createElement('li');
                li.textContent = breed.name;
                li.addEventListener('click', () => {
                    showBreedDetails(breed.id);
                });
                breedsListElement?.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching breeds:', error);
        });

    function fetchBreeds() {
        return fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': API_KEY }
        })
            .then(response => response.json());
    }

    function showBreedDetails(breedId: number) {
        Promise.all([
            fetch(`https://api.thedogapi.com/v1/breeds/${breedId}`, {
                headers: { 'x-api-key': API_KEY }
            }).then(response => response.json()),
            fetch(`https://api.thedogapi.com/v1/images/search?limit=6&breed_id=${breedId}`, {
                headers: { 'x-api-key': API_KEY }
            }).then(response => response.json())
        ])
            .then(([breedDetails, images]) => {
                breedDetailsSection!.setAttribute('data-breed-id', breedId.toString());
                breedImages = images;
                currentImageIndex = 0;
                updateCarouselImage();
                breedNameElement!.textContent = breedDetails.name;
                breedTemperamentElement!.textContent = breedDetails.temperament;
                breedListSection?.classList.add('hidden');
                breedDetailsSection?.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error fetching breed details or images:', error);
            });
    }

    function updateCarouselImage() {
        if (carouselImage && breedImages.length > 0) {
            carouselImage.src = breedImages[currentImageIndex].url;
        }
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + breedImages.length) % breedImages.length;
        updateCarouselImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % breedImages.length;
        updateCarouselImage();
    }
});