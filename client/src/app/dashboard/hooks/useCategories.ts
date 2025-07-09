'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { CategoryType } from '../../../domain/entities/Category';

export function useCategories(type?: CategoryType) {
  const categoryRepository = new ApiCategoryRepository();
  
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      if (type) {
        return await categoryRepository.findByType(type);
      }
      return await categoryRepository.findAll();
    },
  });
}
