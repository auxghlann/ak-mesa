'use client';

import Image from 'next/image';

interface IssuerIconProps {
  issuer: string;
  iconPath?: string;
  className?: string;
  size?: number;
}

export default function IssuerIcon({ issuer, iconPath, className = '', size = 24 }: IssuerIconProps) {
  const getAssetPath = (): string | null => {
    if (iconPath) return iconPath;

    const lower = issuer.toLowerCase();
    if (lower.includes('datacamp')) {
      return '/cert-assets/datacamp-icon.png';
    }
    if (lower.includes('tokyo') || lower.includes('matsuo') || lower.includes('gci')) {
      return '/cert-assets/gci-icon.png';
    }
    if (lower.includes('educative')) {
      return '/cert-assets/educative-icon.png';
    }
    if (lower.includes('kaggle')) {
      return '/cert-assets/kaggle-icon.png';
    }
    if (lower.includes('ibm')) {
      return '/cert-assets/ibm-icon.png';
    }
    if (lower.includes('udemy')) {
      return '/cert-assets/udemy-icon.png';
    }
    if (lower.includes('hugging')) {
      return '/cert-assets/huggingface-icon.png';
    }

    return null;
  };

  const assetSrc = getAssetPath();

  if (!assetSrc) {
    return (
      <span className={`material-symbols-rounded text-[20px] text-on-surface-variant shrink-0 ${className}`}>
        workspace_premium
      </span>
    );
  }

  const isUdemy = issuer.toLowerCase().includes('udemy');

  return (
    <Image
      src={assetSrc}
      alt={`${issuer} logo`}
      width={isUdemy ? 28 : size}
      height={isUdemy ? 28 : size}
      className={`${isUdemy ? 'w-7 h-7' : 'w-6 h-6'} object-contain shrink-0 ${className}`}
    />
  );
}
