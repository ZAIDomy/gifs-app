import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = ()=>{
    const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
    const gifs = JSON.parse(gifsFromLocalStorage);

    return gifs;
}

@Injectable({providedIn: 'root'})
export class GifsService {

    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(true);

    

    trendingGifGroup = computed<Gif[][]>(()=>{
      const groups = [];

      for(let i=0; i<this.trendingGifs().length; i +=3){
        groups.push( this.trendingGifs().slice(i,i+3) );
      }

      return groups;
    })

    searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
    searcgHistoryKeys = computed(()=> Object.keys(this.searchHistory()));

    constructor(){
        this.loadTrendingGifs();
    }

    saveGifsToLocalStorage = effect(()=>{
        const historyString = JSON.stringify(this.searchHistory());
        localStorage.setItem(GIF_KEY,historyString);
    })

    loadTrendingGifs(){
        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`,
            {
                params:{
                    api_key: environment.giphyApiKey,
                    limit: 24,
                },
            }).subscribe( (resp)=>{
                const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
                this.trendingGifs.set(gifs);
                this.trendingGifsLoading.set(false);
            } );
    }

    searchGifs(query:string){
        return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`,
            {
                params:{
                    api_key: environment.giphyApiKey,
                    limit: 24,
                    q: query,
                },
            }).pipe(
                map(({data})=> data ),
                map((items)=> GifMapper.mapGiphyItemsToGifArray(items) ),

                tap(items=>{
                    this.searchHistory.update((history)=>({
                        ...history,
                        [query.toLowerCase()]: items,
                    }));
                })

            );

    }

    getHistoryGfis(query: string):Gif[]{
        return this.searchHistory()[query] ?? [];
    }
}
