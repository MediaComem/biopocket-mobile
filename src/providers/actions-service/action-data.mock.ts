import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Action } from '@models/action';
import { PaginatedResponse, PaginationData } from '@models/paginated-response';

export const mockActions = [
  {
    id: '7354a063-6ac1-4c26-a9a2-4c349ea23e87',
    themeId: 'b8192a6f-760d-4cab-928d-e678a2faaf6c',
    photoUrl: 'https://example.com/B5-3-main.jpg',
    title: 'Akaboku vuk zicepa.',
    description: 'We moj megdopiz mev magudo ut picwahfow belaw akmueba lasruh surlaeno koameta ah gafiji biofidig in.',
    impact: 'Wu butor joceze sidura wibaf lervo libcejan irpemug ezus ercir bip so ezdeodi wofzode.',
    createdAt: '2018-07-16T14:02:25.763Z',
    updatedAt: '2018-07-16T14:02:25.763Z'
  },
  {
    id: 'fd315668-1053-4ae2-82d7-f4ba90122fbb',
    themeId: 'b8192a6f-760d-4cab-928d-e678a2faaf6c',
    photoUrl: 'https://example.com/B8-3-main.jpg',
    title: 'Anudijij zugogzit iduni.',
    description: 'Ba howucdi ticaja udi pidil sa ihza nusbedu dul miv ni ilo buhag kaccooru ju.',
    impact: 'N/A',
    createdAt: '2018-07-16T14:02:25.764Z',
    updatedAt: '2018-07-16T14:02:25.764Z'
  },
  {
    id: 'f92a5bad-3f04-4007-b5ee-53ffe26c4928',
    themeId: 'b8192a6f-760d-4cab-928d-e678a2faaf6c',
    photoUrl: 'https://example.com/C5-3-main.jpg',
    title: 'Apifaad vugeh narbah.',
    description: 'Wu butor joceze sidura wibaf lervo libcejan irpemug ezus ercir bip so ezdeodi wofzode.',
    impact: 'N/A',
    createdAt: '2018-07-16T14:02:25.764Z',
    updatedAt: '2018-07-16T14:02:25.764Z'
  }
];

/**
 * Returns a fake PaginationResponse with three mock Action instances in its body, and pagination headers.
 * By default, the headers indicates that all Actions have been loaded from the first one, with an overall total of 3 available Actions.
 * You can pass an object to this function to change the value of the pagination values.
 * @param {PaginationData} [paginationOpt={ offset: 0, limit: 3, total: 3, filteredTotal: 3 }] PaginationData to override the value of the pagination headers.
 */
export function paginatedResponseMock(paginationOpt: PaginationData = { offset: 0, limit: 3, total: 3, filteredTotal: 3 }) {
  const fakeHttpResponse = new HttpResponse<any[]>({
    body: mockActions,
    headers: new HttpHeaders({
      'pagination-offset': String(paginationOpt.offset),
      'pagination-limit': String(paginationOpt.limit),
      'pagination-total': String(paginationOpt.total),
      'pagination-filtered-total': String(paginationOpt.filteredTotal)
    })
  });

  return new PaginatedResponse<Action>(fakeHttpResponse, data => new Action(data));
}
