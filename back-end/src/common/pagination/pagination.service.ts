import { Model } from 'mongoose';
import { PaginationDto } from './pagination.dto';

export async function paginate<T>(
  model: Model<T>, // Mongoose model (e.g., User, Product, etc.)
  paginationDto: PaginationDto, // DTO chứa các tham số phân trang
  filter: object = {}, // Điều kiện lọc (nếu có)
  projection: object = {}, // Những trường cần lấy ra (nếu có)
  populate?: any,
  sort?: any,
) {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 10;
  const skip = (page - 1) * limit;
  const data = await model
    .find(filter, projection)
    .populate(populate)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();

  const total = await model.countDocuments(filter);

  return {
    data,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}
