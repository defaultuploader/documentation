import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [yaml()],
  },
  site: "https://docs.defaultuploader.com",
  image: {
    service: passthroughImageService(),
  },
  trailingSlash: "always",
  integrations: [
    starlight({
      components: {
        Header: "./src/components/Header.astro",
        Head: "./src/components/Head.astro",
      },
      favicon: "./favicon.ico",
      customCss: ["./src/styles/custom.css"],
      title: {
        ru: "Default Uploader Docs",
        en: "Default Uploader Docs",
      },
      social: {
        github: "https://github.com/orgs/defaultuploader/repositories",
        telegram: "https://t.me/defaultuploader",
        email: "mailto:support@defaultuploader.com",
      },
      sidebar: [
        {
          label: "Introduction",
          translations: {
            ru: "Введение",
          },
          collapsed: true,
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Motivation",
              slug: "introduction/motivation",
              translations: {
                ru: "Мотивация",
              },
            },
            {
              label: "Should I use the Default Uploader?",
              slug: "introduction/choice",
              translations: { ru: "Стоит ли использовать Default Uploader?" },
            },
            {
              label: "Alternative Solutions",
              slug: "introduction/alternatives",
              translations: { ru: "Альтернативные решения" },
            },
            {
              label: "When to Use the Default Uploader",
              slug: "introduction/when-to-use",
              translations: { ru: "Когда использовать Default Uploader" },
            },
            {
              label: "How the Service Works",
              slug: "introduction/how-does-it-work",
              translations: { ru: "Как работает сервис" },
            },
          ],
        },
        {
          label: "Getting Started",
          translations: { ru: "Начать интеграцию" },
          collapsed: true,
          items: [
            {
              label: "Prerequisites",
              slug: "start/prerequisites",
              translations: { ru: "Предварительные требования" },
            },
            {
              label: "Connecting S3 Storage",
              slug: "start/s3-storage",
              translations: { ru: "Как подключить хранилище S3" },
            },
            {
              label: "S3 Storages",
              translations: { ru: "S3 хранилища" },
              items: [
                {
                  label: "Local Testing (MinIO)",
                  slug: "start/s3-list/minio",
                  translations: { ru: "Локальное тестирование (MinIO)" },
                },
                {
                  label: "VK Cloud",
                  slug: "start/s3-list/vk",
                  translations: { ru: "VK Cloud" },
                },
                {
                  label: "Backblaze",
                  slug: "start/s3-list/backblaze",
                  translations: { ru: "Backblaze" },
                },
                {
                  label: "Selectel",
                  slug: "start/s3-list/selectel",
                  translations: { ru: "Selectel" },
                },
                {
                  label: "cloud.ru",
                  slug: "start/s3-list/cloud-ru",
                  translations: { ru: "cloud.ru" },
                },
              ],
            },
            {
              label: "Upload Your First File",
              slug: "start/first-file",
              translations: { ru: "Загрузить первый файл" },
            },
            {
              label: "CDN",
              slug: "start/cdn",
              translations: { ru: "CDN" },
            },
          ],
        },
        {
          label: "Quotas",
          slug: "quotas",
          translations: { ru: "Квоты" },
        },
        {
          label: "Pricing",
          slug: "price",
          translations: { ru: "Цены" },
        },
        {
          label: "API",
          collapsed: true,
          items: [
            {
              label: "REST",
              slug: "api/rest",
              translations: { ru: "REST" },
            },
            {
              label: "Core Features",
              translations: { ru: "Основные возможности" },
              collapsed: true,
              items: [
                {
                  label: "Upload by Custom Path",
                  slug: "api/custom-upload",
                  translations: { ru: "Загрузка по кастомному пути" },
                },
                {
                  label: "Asynchronous Transformations",
                  slug: "api/async-transform",
                  translations: { ru: "Асинхронные трансформации" },
                },
                {
                  label: "Soft Migration",
                  slug: "api/soft-migration",
                  translations: { ru: "Мягкая миграция" },
                },
                {
                  label: "Presigned Upload URL",
                  slug: "api/presigned-url",
                  translations: { ru: "Presigned ссылка для загрузки" },
                },
                {
                  label: "Image Scanning",
                  slug: "api/scan",
                  translations: { ru: "Сканирование изображений" },
                },
                {
                  label: "Transformation Limits",
                  slug: "api/transform-limit",
                  translations: { ru: "Лимит трансформаций" },
                },
              ],
            },
            {
              label: "Transformations",
              translations: { ru: "Трансформации" },
              items: [
                {
                  label: "Images",
                  slug: "api/transform/image",
                  translations: { ru: "Изображения" },
                },
                {
                  label: "Videos",
                  slug: "api/transform/video",
                  translations: { ru: "Видео" },
                },
              ],
            },
            {
              label: "Application Examples",
              slug: "api/examples",
              translations: { ru: "Примеры приложений" },
            },
          ],
        },
      ],
      defaultLocale: "root",
      locales: {
        ru: {
          label: "Русский",
          lang: "ru",
        },
        root: {
          label: "English",
          lang: "en",
        },
      },
    }),
  ],
});
