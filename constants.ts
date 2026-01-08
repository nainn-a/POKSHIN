
import { KPopGroup, GroupMeta } from './types';

/**
 * 1. 그룹별 메인 이미지 (카테고리 선택 화면의 4개 이미지)
 * 각 그룹의 'image' 부분에 원하는 사진의 URL이나 경로를 넣으세요.
 */
export const GROUPS: GroupMeta[] = [
  {
    id: KPopGroup.ONEUS,
    // 원하는 이미지 주소로 교체하세요
    image: './5.jpg',
    color: 'from-blue-600 to-indigo-900',
    description: 'Archive for TOMOON'
  },
  {
    id: KPopGroup.ONF,
    // 원하는 이미지 주소로 교체하세요
    image: './6.jpg',
    color: 'from-sky-100 to-blue-50',
    description: 'Archive for FUSE'
  },
  {
    id: KPopGroup.VERIVERY,
    // 원하는 이미지 주소로 교체하세요
    image: './73.jpg',
    color: 'from-slate-800 to-slate-950',
    description: 'Archive for VERRER'
  },
  {
    id: KPopGroup.P1HARMONY,
    // 원하는 이미지 주소로 교체하세요
    image: './6.jpg',
    color: 'from-cyan-50 to-white',
    description: 'Archive for P1ece'
  }
];

/**
 * 2. 홈 화면 백그라운드 이미지 (첫 구름 화면)
 * 가장 처음에 보이는 배경 화면 이미지를 여기서 수정합니다.
 */
export const HOME_IMAGE = './home.jpg';
