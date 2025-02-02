import {atom,selector} from 'recoil';
import {FilterState, IndicatorData} from '../interfaces/navbar_interfaces';


export const selectedFilterState = atom<FilterState>({
    key: 'selectedFilterState',
    default: {
        indicator: null,
        year: 0,
        month: 0
    },
});

export const calculateDateFromIndicator = selector<Number[]>({
    key: 'calculateDateFromIndicator',
    get: async ({ get }) => {
        const { indicator} = get(selectedFilterState);        
        if (!indicator) return [];

        const response = await fetch('https://mindicador.cl/api/' + indicator);
        const datos: IndicatorData = await response.json();
    
        let year = datos.serie.map(d => new Date(d.fecha).getFullYear()).reduce((a, b) => Math.min(a, b));
        return Array.from({ length: new Date().getFullYear() - year + 1 }, (_, i) => year + i);
    },
});

export const baseIndicatorState = selector<IndicatorData[]>({
    key: 'baseIndicatorState',
    get: async () => {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        return Object.keys(data)
                .filter(key => typeof data[key] === 'object')
                .map((key => ({ key, ...data[key] } as IndicatorData)));
    },
});


export const calculateMonthFromYear = selector<String[]>({
    key: 'calculateMonthFromYear',
    get: async ({ get }) => {
        const { year,indicator } = get(selectedFilterState);
        if (!year) return [];

        //mover esto a un selector aparte
        const response = await fetch('https://mindicador.cl/api/' + indicator);
        const datos: IndicatorData = await response.json();

        if (datos.unidad_medida === 'Porcentaje')
            return []
        else
            return Array.from({ length: 12 }, (_, i) => new Date(year, i).toLocaleString('es', { month: 'long' }));
    },
});

export const checkValidFilters = selector<IndicatorData[]>({
    key: 'checkValidFilters',
    get: async({ get }) => {

        const monthNameToNumber: Record<string, number> = {
            'enero': 1,
            'febrero': 2,
            'marzo': 3,
            'abril': 4,
            'mayo': 5,
            'junio': 6,
            'julio': 7,
            'agosto': 8,
            'septiembre': 9,
            'octubre': 10,
            'noviembre': 11,
            'diciembre': 12
        };

        let datos : IndicatorData[] = [];
        let month_number: number | null = null;

        const { indicator, year, month } = get(selectedFilterState);
        if(indicator === null || year === 0) return [];

        const data = get(baseIndicatorState);
        let item = data.find(item => item.codigo === indicator);
        
        
        if (month != 0) month_number = monthNameToNumber[month];
        else if(item && item.unidad_medida != 'Porcentaje' && month === 0){
            return [];
        }

        const response = await fetch('https://mindicador.cl/api/' + indicator+'/'+year)
        datos = await response.json();

        if(month_number){
            datos = datos.serie.filter(d => {
                let mes = new Date(d.fecha).getMonth() + 1;
                return mes === month_number;
            });
        }
        else datos = datos.serie;

        return datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }
});