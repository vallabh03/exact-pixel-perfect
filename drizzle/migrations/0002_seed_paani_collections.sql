delete from public.collection_assets a using public.collections c where a.collection_id = c.id and c.slug in ('monochrome-muse','yk-x-paani');
delete from public.collections where slug in ('monochrome-muse','yk-x-paani');
insert into public.collections (slug, title, season_label, status, featured, cover_image_url, description, published_at) values
('monochrome-muse','Monochrome Muse','July 2026 Edit','published',true,'/__l5e/assets-v1/fb681917-4e12-4ea0-9db5-22d6512fddd6/paani-muse-01.jpg',
'A celebration of timeless sophistication, where luxurious craftsmanship meets contemporary design. Each garment is thoughtfully created using rich suede fabric, elevated with delicate pearl and stone embellishments, presented in a classic palette of black, white, and emerald green. Designed for the modern woman, these pieces transition seamlessly from graduation ceremonies and formal gatherings to conferences, evening soirees, and special celebrations. ''With every silhouette, my intention was to create garments that feel confident, luxurious, and timeless — pieces that make a statement without saying a word.'' — Pavani Tumukunta', now()),
('yk-x-paani','YK x PAANI','January 2026 Edit','published',false,'/__l5e/assets-v1/3d40a5af-c50f-4973-9171-c58f12b85315/paani-yk-03.jpg',
'A collaboration between architecture and fashion. One of us is trained in designing spaces people inhabit, the other comes from fashion, where the body is always the starting point. Clothing, here, becomes a meeting ground and an intimate scale of the built environment that is worn. Presented in three edits — Midnight Retro, Luxe Bloom, and Satin Romance — the pieces are designed to be inclusive, adaptable, and responsive to diverse body types, with a conscious focus on how women feel within what they wear. ''At its core, this project is about making women feel supported and seen.'' — Dr. Yeshashwini Kadiiri and Pavani Tumukunta', now());
with m as (select id from public.collections where slug='monochrome-muse')
insert into public.collection_assets (collection_id, image_url, title, description, sort_order)
select m.id, v.url, v.title, v.descr, v.ord from m, (values
('/__l5e/assets-v1/fb681917-4e12-4ea0-9db5-22d6512fddd6/paani-muse-01.jpg','Look 01','Look 01',1),
('/__l5e/assets-v1/94cd87df-977f-4315-9c11-c40c45e1516a/paani-muse-02.jpg','Look 02','Look 02',2),
('/__l5e/assets-v1/62bc9f34-eee9-4a51-b6b4-d70704f42660/paani-muse-03.jpg','Look 03','Look 03',3),
('/__l5e/assets-v1/c4ad3b51-0dc8-4d96-adbc-1baf8cdeba7e/paani-muse-07.jpg','Look 04','Look 04',4),
('/__l5e/assets-v1/32eaf199-f47b-4267-b5ad-444be21e2744/paani-muse-08.jpg','Look 05','Look 05',5),
('/__l5e/assets-v1/9d01126d-0c4c-4f4c-b481-83cada246119/paani-muse-09.jpg','Look 06','Look 06',6),
('/__l5e/assets-v1/08a594ae-46d0-4ad4-82f4-ecd07cf618ef/paani-muse-10.jpg','Look 07','Look 07',7),
('/__l5e/assets-v1/db1e6c3f-217a-49b0-bbb4-00a157607506/paani-muse-11.jpg','Look 08','Look 08',8),
('/__l5e/assets-v1/9f859e89-3bed-4326-98e7-a44b23459572/paani-muse-12.jpg','Look 09','Look 09',9),
('/__l5e/assets-v1/71c80cff-54c4-4a8f-b77b-d7949d45a979/paani-muse-13.jpg','Look 10','Look 10',10),
('/__l5e/assets-v1/3b93fd32-af33-4220-ad1c-bdfcd2878b76/paani-muse-14.jpg','Look 11','Look 11',11),
('/__l5e/assets-v1/faadde04-738e-4d0a-8882-c598da6764c5/paani-muse-15.jpg','Look 12','Look 12',12),
('/__l5e/assets-v1/33f1917c-33e4-478a-94df-7375de3b4f2a/paani-muse-16.jpg','Look 13','Look 13',13),
('/__l5e/assets-v1/abec9dda-7e75-4f77-b41e-93a5bfa0f3e4/paani-muse-17.jpg','Look 14','Look 14',14),
('/__l5e/assets-v1/96c19fec-d0b8-465e-bf31-3da92dc04325/paani-muse-18.jpg','Look 15','Look 15',15),
('/__l5e/assets-v1/5548a0e4-81f7-490f-8650-0c539a626633/paani-muse-19.jpg','Look 16','Look 16',16),
('/__l5e/assets-v1/e8f85f3e-0e1a-4033-b40e-45b1600ec1ef/paani-muse-20.jpg','Look 17','Look 17',17),
('/__l5e/assets-v1/ab205fa4-0955-4aa7-a3e6-e0f19aef6c39/paani-muse-21.jpg','Look 18','Look 18',18),
('/__l5e/assets-v1/bc7c7bb2-295b-480e-a0bc-2e2a852e7879/paani-muse-23.jpg','Look 19','Look 19',19),
('/__l5e/assets-v1/79c349a0-172f-48ec-ab5b-134fc69c6bfa/paani-muse-24.jpg','Look 20','Look 20',20)
) as v(url,title,descr,ord);
with y as (select id from public.collections where slug='yk-x-paani')
insert into public.collection_assets (collection_id, image_url, title, description, sort_order)
select y.id, v.url, v.title, v.descr, v.ord from y, (values
('/__l5e/assets-v1/3d40a5af-c50f-4973-9171-c58f12b85315/paani-yk-03.jpg','Look 01','Look 01',1),
('/__l5e/assets-v1/b35c3f07-7c80-4278-8e3b-222761e474a3/paani-yk-04.jpg','Look 02','Look 02',2),
('/__l5e/assets-v1/2c5193a4-90a7-40f9-a8eb-a5d3113c70a3/paani-yk-05.png','Look 03','Look 03',3),
('/__l5e/assets-v1/ce0d2d2b-0d64-412f-ae0c-3b9f6812c6f4/paani-yk-06.jpg','Look 04','Look 04',4),
('/__l5e/assets-v1/6948de2f-33ba-4f94-b746-1c70efa343a9/paani-yk-07.jpg','Look 05','Look 05',5),
('/__l5e/assets-v1/beea7de4-0f1a-4d30-9d6e-5e9ffd661ee2/paani-yk-08.jpg','Look 06','Look 06',6),
('/__l5e/assets-v1/c31df8a6-0b11-446e-a7cd-144292b725b7/paani-yk-09.jpg','Look 07','Look 07',7),
('/__l5e/assets-v1/80af5ace-69e5-4452-b19a-0a1179feaa57/paani-yk-10.jpg','Look 08','Look 08',8),
('/__l5e/assets-v1/d801147d-bb78-4cf1-9556-d78a6a8c23be/paani-yk-11.jpg','Look 09','Look 09',9),
('/__l5e/assets-v1/4fb71303-834a-46fb-9b5f-f0dd52b823ea/paani-yk-12.jpg','Look 10','Look 10',10),
('/__l5e/assets-v1/4ef23334-4757-43ba-9ab0-103ea9dcb252/paani-yk-13.png','Look 11','Look 11',11),
('/__l5e/assets-v1/74b59525-9772-44e2-8830-fc714acb36ae/paani-yk-14.jpg','Look 12','Look 12',12),
('/__l5e/assets-v1/9d0307ef-3f1c-499e-8667-8a3bb96bde62/paani-yk-15.jpg','Look 13','Look 13',13),
('/__l5e/assets-v1/7358b1d4-2147-4156-b0c2-c19fa265dbf6/paani-yk-16.png','Look 14','Look 14',14),
('/__l5e/assets-v1/8486e477-1805-4c2c-83f9-a0f966a6a0dc/paani-yk-17.jpg','Look 15','Look 15',15),
('/__l5e/assets-v1/369f7b3d-5c32-45df-87de-cd1754c878d4/paani-yk-18.jpg','Look 16','Look 16',16),
('/__l5e/assets-v1/b5f1116d-72c2-4dc6-b4c2-3cc171001d5a/paani-yk-19.jpg','Look 17','Look 17',17),
('/__l5e/assets-v1/71a2de35-d3db-47ad-a27b-e3166a6dea6d/paani-yk-20.jpg','Look 18','Look 18',18),
('/__l5e/assets-v1/cae00d21-a2f4-4272-9c38-89f3626a43e2/paani-yk-21.jpg','Look 19','Look 19',19),
('/__l5e/assets-v1/ea9ff462-45d8-4173-ba79-565c60dbf0c5/paani-yk-22.jpg','Look 20','Look 20',20),
('/__l5e/assets-v1/a9f16bd0-f9ee-4b97-8f66-38ead65c8198/paani-yk-23.jpg','Look 21','Look 21',21),
('/__l5e/assets-v1/a0b22ed1-f0eb-43e3-b49a-2f1ee4deeac0/paani-yk-24.jpg','Look 22','Look 22',22),
('/__l5e/assets-v1/040535c3-a265-4e03-9fbb-0213397ab23f/paani-yk-25.jpg','Look 23','Look 23',23),
('/__l5e/assets-v1/176bbf8b-ac73-4381-9589-f963ce9411c4/paani-yk-26.jpg','Look 24','Look 24',24),
('/__l5e/assets-v1/6d45f28e-72d5-401d-ad4a-ccb2be04e1b1/paani-yk-27.jpg','Look 25','Look 25',25),
('/__l5e/assets-v1/a2da1763-33df-46d8-9c11-bacbd9047bcf/paani-yk-28.jpg','Look 26','Look 26',26),
('/__l5e/assets-v1/77b35779-0d7b-4d46-b064-91ebaf11325a/paani-yk-29.jpg','Look 27','Look 27',27),
('/__l5e/assets-v1/436979f6-4be3-40d9-8544-11980dc10c8d/paani-yk-30.png','Look 28','Look 28',28),
('/__l5e/assets-v1/1ac9f473-6540-4cec-bc69-a51c4a4d12a0/paani-yk-31.jpg','Look 29','Look 29',29),
('/__l5e/assets-v1/ecc4b32a-8dba-495a-b758-e46e8c266aac/paani-yk-32.jpg','Look 30','Look 30',30),
('/__l5e/assets-v1/33a3dd70-dd21-4b9c-b51e-4f102c84a5cf/paani-yk-33.jpg','Look 31','Look 31',31),
('/__l5e/assets-v1/efe67fc3-0815-4d20-918a-58f6ea8597ef/paani-yk-34.jpg','Look 32','Look 32',32)
) as v(url,title,descr,ord);