import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titleCase'})
export class TitleCasePipe implements PipeTransform {
    public transform(input:string): string{
        if (!input) {
            return '';
        } else {
            return input.replace(/\b\w/g, first => first.toLocaleUpperCase())
        }
    }
}
