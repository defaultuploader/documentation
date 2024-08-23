import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			components: {
				Header: './src/components/Header.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/withastro/starlight/edit/main/',
			},
			favicon: '/public/favicon.ico',
			customCss: [
				'./src/styles/custom.css',
			],
			title: {
				ru: "Default Uploader Docs",
				en: "Default Uploader Docs"
			},
			social: {
				github: 'https://github.com/orgs/defaultuploader/repositories',
			},
			sidebar: [
				{
					label: 'Введение',
					collapsed: true,
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Мотивация', slug: 'introduction/motivation' },
						{ label: 'Стоит ли использовать Default Uploader?', slug: 'introduction/choice' },
						{ label: 'Альтернативные решения', slug: 'introduction/alternatives' },
						{ label: 'Когда использовать Default Uploader', slug: 'introduction/when-to-use' },
						{ label: 'Как работает сервис', slug: 'introduction/how-does-it-work' },
					],
				},
				{
					label: 'Начать интеграцию',
					collapsed: true,
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Предварительные требования', slug: 'start/prerequisites' },
						{
							label: 'Как подключить хранилище S3',
							slug: 'start/s3-storage',
						},
						{
							label: 'S3 хранилища',
							items: [
								{
									label: 'VK Cloud',
									slug: 'start/s3-list/vk',
								},
								{
									label: 'Backblaze',
									slug: 'start/s3-list/backblaze',
								},
								{
									label: 'Selectel',
									slug: 'start/s3-list/selectel',
								}
							]
						},
						{
							label: 'Загрузить первый файл',
							slug: 'start/first-file'
						},
						{
							label: 'CDN',
							slug: 'start/cdn'
						},
					],
				},
				{
					label: 'Квоты',
					slug: 'quotas'
				},
				{
					label: 'Цены',
					slug: 'price'
				},
				{
					label: 'API',
					collapsed: true,
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Введение', slug: 'api/intro' },
						{ label: 'REST', slug: 'api/rest' },
						{
							label: 'Основные возможности',
							collapsed: true,
							items: [
								{ label: 'Загрузка по кастомному пути', slug: 'api/custom-upload' },
								{ label: 'Асинхронные трансформации', slug: 'api/async-transform' },
								{ label: 'Мягкая миграция', slug: 'api/soft-migration' },
								{ label: 'Presigned ссылка для загрузки', slug: 'api/presigned-url' },
								{ label: 'Сканирование изображений', slug: 'api/scan' },
								{ label: 'Лимит трансформаций', slug: 'api/transform-limit' },
							]
						},
						{
							label: 'Трансформации',
							collapsed: true,
							items: [
								{
									label: 'Изображения',
									slug: 'api/transform/image',
								},
								{
									label: 'Видео',
									slug: 'api/transform/video'
								},
							]
						},
						{
							label: 'Примеры приложений',
							slug: 'api/examples'
						},
					],
				},
			],
			defaultLocale: 'ru',
			// Set English as the default language for this site.
			locales: {
				// English docs in `src/content/docs/en/`
				en: {
					label: 'English',
					lang: 'en',
				},
				// Simplified Chinese docs in `src/content/docs/zh-cn/`
				ru: {
					label: 'Русский',
					lang: 'ru',
				},
			},
		}),
	],
});
