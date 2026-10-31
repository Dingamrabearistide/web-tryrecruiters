import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="items-table">
      <tr *ngFor="let key of objectKeys(data)">
        <td class="key-column">{{ formatKey(key) }}</td>
        <td class="value-column">
          <ng-container *ngIf="isArray(data[key]); else singleValue">
            <ul>
              <li *ngFor="let item of data[key]">
                {{ item || '(vide)' }}
              </li>
            </ul>
          </ng-container>
          <ng-template #singleValue>
            {{ data[key] }}
          </ng-template>
        </td>
      </tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        vertical-align: top;
      }

      .key-column {
        font-weight: bold;
        width: 40%;
      }

      .value-column {
        width: 60%;
      }

      ul {
        margin: 0;
        padding-left: 1rem;
        list-style: circle;
      }
    `,
  ],
})
export class DisplayItemComponent {
  @Input() data: Record<string, any> = {};

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
