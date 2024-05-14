import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import { Errors } from '@/types/Errors';
import createPost from '@apis/post/createPost';
import { posts } from '@queries/usePostQueries';

export interface ContentField {
  title: string;
  content: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  cityLat: number;
  cityLng: number;
  actualLat: number;
  actualLng: number;
  category: string;
  subcategory: string;
  address: string;
  image: File[];
}

// 수정된 onSubmit 함수
type LatLngLiteralOrNull = google.maps.LatLngLiteral | null;

export default function useCreateForm(toggleModal: () => void) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContentField>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPosition, setCurrentPosition] = useState<LatLngLiteralOrNull>({ lat: 0, lng: 0 });
  const queryClient = useQueryClient();

  function cancelForm() {
    reset();
    toggleModal();
  }

  useEffect(() => {
    // 페이지가 로드될 때 현재 위치 가져오기
    getCurrentPosition();
  }, []);

  const getCurrentPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current position', error);
        },
      );
    } else {
      console.error('Geolocation is not available');
    }
  };

  async function onSubmit(formData: ContentField) {
    console.log(formData);

    formData = {
      ...formData,
      cityLat: 37.5518911, // 시티 레벨 검색바에서 가져오기
      cityLng: 126.9917937, // 시티 레벨 검색바에서 가져오기
      city: '서울', // 시티 레벨 검색바에서 가져오기
      country: '대한민국', // 시티 레벨 검색바에서 가져오기
      actualLat: currentPosition?.lat ?? 0,
      actualLng: currentPosition?.lng ?? 0,
      lat: 37.499866,
      lng: 127.024832,
      category: 'QUESTION', // 카테고리 중복선택 이슈4
      // subcategory: '음식점',
    };

    try {
      if (currentPosition) {
        const formDataToSend = new FormData();

        // 이미지 파일 추가
        for (let i = 0; i < formData.image.length; i++) {
          formDataToSend.append('file', formData.image[i]);
        }

        // 데이터 추가
        formDataToSend.append('data', new Blob([JSON.stringify(formData)]));

        await createPost(formDataToSend);
        // 임시: 만들어졌을 시 피드 업데이트
        queryClient.invalidateQueries({ queryKey: posts.feedList().queryKey });
        console.log('Post created successfully');
      } else {
        console.error('Current position is null');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }

    toggleModal();
  }

  return { getCurrentPosition, register, setValue, handleSubmit, onSubmit, cancelForm, errors: errors as Errors };
}
