const API_KEY = ''
const MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const form = document.querySelector('form')!
const addressInput = document.getElementById('address')! as HTMLInputElement

type AddressResult = {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }[]
  status: 'OK' | 'ZERO_RESULTS'
}

async function searcHandler(e: Event) {
    e.preventDefault()

    const adress = encodeURI(addressInput.value);
    const result = await request<AddressResult>({url: `${MAPS_API_URL}?address=${adress}&key=${API_KEY}`})
    const { lat, lng } = result?.results[0].geometry.location!

    const map = new google.maps.Map(document.getElementById('map')!, {
      center: { lat, lng },
      zoom: 8
    });

    new google.maps.Marker({ position: { lat, lng }, map})

}

form.addEventListener('submit', searcHandler)

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
 
type RequestProps = {
  url: string;
 
  method?: RequestMethod;
};

async function request<Result>({
  url,
  method = 'get',
}: RequestProps): Promise<Result | null> {
 
  try {
    const response = await fetch(url, {
      method,
    });

    if (!response.ok) {
      const err = `Error: ${response.status} - ${response.statusText}`;
      throw new Error(err);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}