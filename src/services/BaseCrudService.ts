// services/BaseCrudService.ts
import api from "./api";

export class BaseCrudService<T, CreateDto, UpdateDto> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async findAll(params?: any): Promise<T[]> {
    const response = await api.get(this.endpoint, { params });
    return response.data;
  }

  async findOne(id: string): Promise<T> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: CreateDto): Promise<T> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    const response = await api.patch(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}
