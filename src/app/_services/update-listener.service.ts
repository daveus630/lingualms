import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UpdateListenerService {
  constructor() {}

  addUpdateListener(value: any, dataSource: any) {
    dataSource.data.push(value);
    dataSource.data.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    dataSource._updateChangeSubscription();
  }
}
