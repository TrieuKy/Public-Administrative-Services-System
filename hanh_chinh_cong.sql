--
-- PostgreSQL database dump
--

\restrict advx8gXYYHt41ygeO7PBnXGN5NORDnG6EaLrvAfPCaIPhCYktDaU09LHUx86uTv

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-12 21:28:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5425 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 913 (class 1247 OID 19551)
-- Name: enum_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_applications_status AS ENUM (
    'DRAFT',
    'PENDING',
    'PROCESSING',
    'NEED_MORE',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.enum_applications_status OWNER TO postgres;

--
-- TOC entry 925 (class 1247 OID 19638)
-- Name: enum_comments_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_comments_type AS ENUM (
    'internal',
    'public'
);


ALTER TYPE public.enum_comments_type OWNER TO postgres;

--
-- TOC entry 937 (class 1247 OID 25374)
-- Name: enum_schedules_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_priority AS ENUM (
    'normal',
    'urgent'
);


ALTER TYPE public.enum_schedules_priority OWNER TO postgres;

--
-- TOC entry 934 (class 1247 OID 25366)
-- Name: enum_schedules_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_schedules_status OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 19509)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'citizen',
    'officer',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- TOC entry 898 (class 1247 OID 16470)
-- Name: hanh_dong_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.hanh_dong_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'APPROVE',
    'REJECT',
    'REQUEST_MORE'
);


ALTER TYPE public.hanh_dong_enum OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 16422)
-- Name: kenh_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kenh_enum AS ENUM (
    'EMAIL',
    'SMS',
    'IN_APP'
);


ALTER TYPE public.kenh_enum OWNER TO postgres;

--
-- TOC entry 895 (class 1247 OID 16460)
-- Name: loai_ai_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_ai_enum AS ENUM (
    'OCR',
    'COMPLETENESS',
    'CONSISTENCY',
    'CHATBOT'
);


ALTER TYPE public.loai_ai_enum OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 16454)
-- Name: loai_cmt_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_cmt_enum AS ENUM (
    'INTERNAL',
    'FEEDBACK'
);


ALTER TYPE public.loai_cmt_enum OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 16444)
-- Name: loai_file_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_file_enum AS ENUM (
    'PDF',
    'JPG',
    'PNG',
    'JPEG'
);


ALTER TYPE public.loai_file_enum OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 16430)
-- Name: loai_notif_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_notif_enum AS ENUM (
    'HO_SO_MOI',
    'DUYET',
    'TU_CHOI',
    'BO_SUNG',
    'NHAC_NHO',
    'HE_THONG'
);


ALTER TYPE public.loai_notif_enum OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 16408)
-- Name: trang_thai_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trang_thai_enum AS ENUM (
    'PENDING',
    'PROCESSING',
    'NEED_MORE',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.trang_thai_enum OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 16401)
-- Name: vai_tro_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vai_tro_enum AS ENUM (
    'CITIZEN',
    'OFFICER',
    'ADMIN'
);


ALTER TYPE public.vai_tro_enum OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 16722)
-- Name: fn_cap_nhat_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_cap_nhat_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.ngay_cap_nhat = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_cap_nhat_timestamp() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 16729)
-- Name: fn_set_han_xu_ly(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_set_han_xu_ly() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_thoi_gian INT;
BEGIN
  SELECT thoi_gian_xu_ly INTO v_thoi_gian
  FROM services WHERE id = NEW.dich_vu_id;

  IF NEW.han_xu_ly IS NULL THEN
    NEW.han_xu_ly := CURRENT_DATE + v_thoi_gian;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_set_han_xu_ly() OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 16727)
-- Name: fn_tao_ma_ho_so(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_tao_ma_ho_so() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_nam   TEXT;
  v_so_tt INT;
BEGIN
  v_nam := TO_CHAR(NOW(), 'YYYY');

  SELECT COUNT(*) + 1 INTO v_so_tt
  FROM applications
  WHERE EXTRACT(YEAR FROM ngay_nop) = EXTRACT(YEAR FROM NOW());

  NEW.ma_ho_so := 'HC-' || v_nam || '-' || LPAD(v_so_tt::TEXT, 6, '0');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_tao_ma_ho_so() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 19667)
-- Name: ai_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_logs (
    id uuid NOT NULL,
    "applicationId" uuid,
    type character varying(255),
    input jsonb,
    output jsonb,
    confidence double precision,
    "durationMs" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ai_logs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25400)
-- Name: application_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_histories (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    "actorId" uuid,
    action character varying(255) NOT NULL,
    note text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.application_histories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19565)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id uuid NOT NULL,
    "applicationCode" character varying(255),
    "userId" uuid NOT NULL,
    "serviceId" uuid NOT NULL,
    "officerId" uuid,
    "formData" jsonb DEFAULT '{}'::jsonb,
    status public.enum_applications_status DEFAULT 'DRAFT'::public.enum_applications_status,
    "cancelReason" text,
    "rejectReason" text,
    "officerNote" text,
    "submittedAt" timestamp with time zone,
    "completedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    deadline timestamp with time zone,
    rating integer,
    "ratingContent" text
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16701)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nguoi_dung_id uuid,
    ho_so_id uuid,
    bang_lien_quan character varying(50) NOT NULL,
    ban_ghi_id uuid,
    hanh_dong public.hanh_dong_enum NOT NULL,
    du_lieu_cu jsonb,
    du_lieu_moi jsonb,
    dia_chi_ip character varying(45),
    user_agent character varying(255),
    thoi_gian timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 19643)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    "authorId" uuid NOT NULL,
    content text NOT NULL,
    type public.enum_comments_type DEFAULT 'internal'::public.enum_comments_type,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19596)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    "docType" character varying(255) NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "fileUrl" character varying(255),
    "filePath" character varying(255),
    "mimeType" character varying(255),
    "fileSize" integer,
    "isSupplement" boolean DEFAULT false,
    "aiStatus" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19615)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "applicationId" uuid,
    type character varying(255),
    title character varying(255),
    message text,
    "isRead" boolean DEFAULT false,
    "emailSentAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25379)
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    "timeInfo" character varying(255) NOT NULL,
    date date NOT NULL,
    status public.enum_schedules_status DEFAULT 'pending'::public.enum_schedules_status,
    priority public.enum_schedules_priority DEFAULT 'normal'::public.enum_schedules_priority,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19535)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    description text,
    "processingDays" integer DEFAULT 5,
    "requiredDocs" jsonb DEFAULT '[]'::jsonb,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19515)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    "fullName" character varying(255) NOT NULL,
    cccd character varying(12) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'citizen'::public.enum_users_role,
    "isVerified" boolean DEFAULT false,
    "verifyToken" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    dob date,
    phone character varying(255),
    gender character varying(255),
    pob character varying(255),
    hometown character varying(255),
    address character varying(255),
    "taxCode" character varying(255),
    "insuranceCode" character varying(255),
    passport character varying(255),
    "driverLicense" character varying(255),
    nationality character varying(255),
    "issueDate" date,
    "expiryDate" date,
    "issuePlace" character varying(255),
    "officerCode" character varying(255),
    department character varying(255),
    "workPhone" character varying(255),
    "position" character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5417 (class 0 OID 19667)
-- Dependencies: 229
-- Data for Name: ai_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_logs (id, "applicationId", type, input, output, confidence, "durationMs", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5419 (class 0 OID 25400)
-- Dependencies: 231
-- Data for Name: application_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_histories (id, "applicationId", "actorId", action, note, "createdAt", "updatedAt") FROM stdin;
1297db54-1422-4929-8c4d-c339dd320c0f	70084161-c4db-4ee8-b1c2-efa88069e98f	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Duyệt hồ sơ	Duyệt thành công	2026-04-10 10:50:36.132+07	2026-04-10 10:50:36.132+07
1f3eb190-7988-4345-9d8e-b78066e9addb	358cef6d-f21d-41cb-95a4-5dafa80992ab	2696e005-5313-45e4-8fb0-694b1197b742	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-04-10 11:17:15.989+07	2026-04-10 11:17:15.989+07
680a70dd-5e9f-4eab-bac9-382fcfa31809	358cef6d-f21d-41cb-95a4-5dafa80992ab	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Duyệt hồ sơ	Duyệt thành công	2026-04-10 11:18:04.572+07	2026-04-10 11:18:04.572+07
\.


--
-- TOC entry 5413 (class 0 OID 19565)
-- Dependencies: 225
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, "applicationCode", "userId", "serviceId", "officerId", "formData", status, "cancelReason", "rejectReason", "officerNote", "submittedAt", "completedAt", "createdAt", "updatedAt", deadline, rating, "ratingContent") FROM stdin;
462e577d-bc7d-4881-8af8-c91ccc6b4b2b	HS-2026-000001	2696e005-5313-45e4-8fb0-694b1197b742	9ec13ab2-9741-4b68-8c86-5f8c042453fb	\N	{"email": "kid14190@gmail.com", "phone": "086798439", "fullName": " triệu đoan kỳ", "idNumber": "097639277192"}	DRAFT	\N	\N	\N	\N	\N	2026-04-09 09:59:10.01+07	2026-04-09 09:59:10.01+07	\N	\N	\N
d42bb7c7-a9de-42f5-b130-5a0ae3e59616	HS-2026-000002	2696e005-5313-45e4-8fb0-694b1197b742	9ec13ab2-9741-4b68-8c86-5f8c042453fb	\N	{"email": "kid14190@gmail.com", "phone": "086798439", "fullName": " triệu đoan kỳ", "idNumber": "097639277192"}	DRAFT	\N	\N	\N	\N	\N	2026-04-09 09:59:17.478+07	2026-04-09 09:59:17.478+07	\N	\N	\N
70084161-c4db-4ee8-b1c2-efa88069e98f	HS-2026-000003	2696e005-5313-45e4-8fb0-694b1197b742	9ec13ab2-9741-4b68-8c86-5f8c042453fb	63489bf3-5713-4aed-a5da-c7b47f7f04ee	{"email": "kid14190@gmail.com", "phone": "086798439", "fullName": " triệu đoan kỳ", "idNumber": "097639277192"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-09 10:00:09.998+07	2026-04-10 10:50:36.122+07	2026-04-09 10:00:09.869+07	2026-04-10 10:50:36.123+07	\N	\N	\N
358cef6d-f21d-41cb-95a4-5dafa80992ab	HS-2026-000004	2696e005-5313-45e4-8fb0-694b1197b742	3b0d1603-2da0-490f-9d1c-36efb82e0018	63489bf3-5713-4aed-a5da-c7b47f7f04ee	{"email": "kid14190@gmail.com", "phone": "09573923783", "fullName": "Triệu Đoan Kỳ", "idNumber": "0755555555"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-10 11:17:15.984+07	2026-04-10 11:18:04.566+07	2026-04-10 11:17:15.827+07	2026-04-10 11:18:04.566+07	2026-04-25 11:17:15.984+07	\N	\N
\.


--
-- TOC entry 5410 (class 0 OID 16701)
-- Dependencies: 222
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, nguoi_dung_id, ho_so_id, bang_lien_quan, ban_ghi_id, hanh_dong, du_lieu_cu, du_lieu_moi, dia_chi_ip, user_agent, thoi_gian) FROM stdin;
\.


--
-- TOC entry 5416 (class 0 OID 19643)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, "applicationId", "authorId", content, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5414 (class 0 OID 19596)
-- Dependencies: 226
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, "applicationId", "docType", "fileName", "fileUrl", "filePath", "mimeType", "fileSize", "isSupplement", "aiStatus", "createdAt", "updatedAt") FROM stdin;
7b31fd2b-8e83-4d32-b038-524dee4d254f	d42bb7c7-a9de-42f5-b130-5a0ae3e59616	Tài liệu bắt buộc	CCCD Back.jpg	/uploads/1775703557489-392467647.jpg	uploads\\1775703557489-392467647.jpg	image/jpeg	1110225	f	\N	2026-04-09 09:59:17.506+07	2026-04-09 09:59:17.506+07
23612da3-40d6-4ad4-b0be-2a0c6f6ee8d8	d42bb7c7-a9de-42f5-b130-5a0ae3e59616	Tài liệu bắt buộc	lam-giay-ket-hon-gia1.jpg	/uploads/1775703557521-650851355.jpg	uploads\\1775703557521-650851355.jpg	image/jpeg	49724	f	\N	2026-04-09 09:59:17.528+07	2026-04-09 09:59:17.528+07
18a649f5-4e2d-4844-9466-f8c6ae8185f3	70084161-c4db-4ee8-b1c2-efa88069e98f	Tài liệu bắt buộc	CCCD Back.jpg	/uploads/1775703609905-414620001.jpg	uploads\\1775703609905-414620001.jpg	image/jpeg	1110225	f	\N	2026-04-09 10:00:09.919+07	2026-04-09 10:00:09.919+07
35fcd0bd-9570-4a80-aaec-32175969c040	70084161-c4db-4ee8-b1c2-efa88069e98f	Tài liệu bắt buộc	lam-giay-ket-hon-gia1.jpg	/uploads/1775703609932-439338772.jpg	uploads\\1775703609932-439338772.jpg	image/jpeg	49724	f	\N	2026-04-09 10:00:09.939+07	2026-04-09 10:00:09.939+07
5c421f60-6991-4b56-9e9b-de7c7b5794de	70084161-c4db-4ee8-b1c2-efa88069e98f	Tài liệu bắt buộc	download.jpg	/uploads/1775703609951-810937385.jpg	uploads\\1775703609951-810937385.jpg	image/jpeg	6480	f	\N	2026-04-09 10:00:09.956+07	2026-04-09 10:00:09.956+07
dfc1372f-ca9d-470c-99fb-5446516680a3	70084161-c4db-4ee8-b1c2-efa88069e98f	Tài liệu bắt buộc	20150204181626-a18.jpg	/uploads/1775703609966-913752715.jpg	uploads\\1775703609966-913752715.jpg	image/jpeg	16791	f	\N	2026-04-09 10:00:09.973+07	2026-04-09 10:00:09.973+07
2488b5df-e3d4-4ed2-9953-085ad909b4aa	358cef6d-f21d-41cb-95a4-5dafa80992ab	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1775794635884-190405355.png	uploads\\1775794635884-190405355.png	image/png	3317756	f	\N	2026-04-10 11:17:15.921+07	2026-04-10 11:17:15.921+07
89e204b1-ed19-46c9-ac36-637dee6bca03	358cef6d-f21d-41cb-95a4-5dafa80992ab	Tài liệu bắt buộc	xin xÃ¡c nháº­n cÆ° trÃº.jpg	/uploads/1775794635933-228933283.jpg	uploads\\1775794635933-228933283.jpg	image/jpeg	70091	f	\N	2026-04-10 11:17:15.937+07	2026-04-10 11:17:15.937+07
bb4d6960-eb99-42f5-8aa4-075b982b26c7	358cef6d-f21d-41cb-95a4-5dafa80992ab	Tài liệu bắt buộc	CCCD Back.jpg	/uploads/1775794635947-58840754.jpg	uploads\\1775794635947-58840754.jpg	image/jpeg	1110225	f	\N	2026-04-10 11:17:15.962+07	2026-04-10 11:17:15.962+07
\.


--
-- TOC entry 5415 (class 0 OID 19615)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", "applicationId", type, title, message, "isRead", "emailSentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5418 (class 0 OID 25379)
-- Dependencies: 230
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, "userId", title, "timeInfo", date, status, priority, "createdAt", "updatedAt") FROM stdin;
c2925c30-0be7-4ad1-a7b3-4ac04a5676e8	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Tiếp nhận hồ sơ buổi sáng	08:00	2026-04-10	completed	normal	2026-04-10 10:36:09.672+07	2026-04-10 10:36:09.672+07
af6abe2c-4d89-4a95-9403-dc7b84fd40f8	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Duyệt 5 hồ sơ khai sinh đang chờ	09:30	2026-04-10	pending	urgent	2026-04-10 10:36:09.672+07	2026-04-10 10:36:09.672+07
3adca0e5-672d-43de-ba05-4b204a5108af	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Họp bộ phận một cửa	10:00	2026-04-10	pending	normal	2026-04-10 10:36:09.672+07	2026-04-10 10:36:09.672+07
bd256804-08a1-45a4-ad8e-1e3c337d2850	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Tiếp nhận hồ sơ buổi chiều	13:30	2026-04-10	pending	normal	2026-04-10 10:36:09.672+07	2026-04-10 10:36:09.672+07
09eea011-e4ff-405e-a103-f30b241a9335	63489bf3-5713-4aed-a5da-c7b47f7f04ee	Báo cáo kết quả tuần cho trưởng bộ phận	15:00	2026-04-10	pending	urgent	2026-04-10 10:36:09.672+07	2026-04-10 10:36:09.672+07
\.


--
-- TOC entry 5412 (class 0 OID 19535)
-- Dependencies: 224
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, category, description, "processingDays", "requiredDocs", "isActive", "createdAt", "updatedAt") FROM stdin;
9ec13ab2-9741-4b68-8c86-5f8c042453fb	Đăng ký khai sinh	Hộ tịch	\N	3	["Giấy chứng sinh", "CMND/CCCD cha mẹ", "Giấy đăng ký kết hôn"]	t	2026-04-09 09:56:55.128+07	2026-04-09 09:56:55.128+07
be64665d-63d4-49e6-b6ac-68253ee2e700	Đăng ký kết hôn	Hộ tịch	\N	5	["Giấy xác nhận tình trạng hôn nhân", "CMND/CCCD hai bên", "Sổ hộ khẩu"]	t	2026-04-09 09:56:55.128+07	2026-04-09 09:56:55.128+07
fd3c73c5-3cb9-45ca-aed2-a95f5b343cbb	Đăng ký thường trú	Cư trú	\N	7	["Mẫu CT01 - Tờ khai thay đổi thông tin cư trú", "Giấy tờ chứng minh chỗ ở hợp pháp"]	t	2026-04-09 09:56:55.128+07	2026-04-09 09:56:55.128+07
3b0d1603-2da0-490f-9d1c-36efb82e0018	Cấp chứng minh thư / CCCD	Cư trú	\N	15	["Sổ hộ khẩu", "Tờ khai cấp CCCD", "Ảnh thẻ 4x6"]	t	2026-04-09 09:56:55.128+07	2026-04-09 09:56:55.128+07
\.


--
-- TOC entry 5411 (class 0 OID 19515)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "fullName", cccd, email, password, role, "isVerified", "verifyToken", "createdAt", "updatedAt", dob, phone, gender, pob, hometown, address, "taxCode", "insuranceCode", passport, "driverLicense", nationality, "issueDate", "expiryDate", "issuePlace", "officerCode", department, "workPhone", "position") FROM stdin;
2696e005-5313-45e4-8fb0-694b1197b742	Triệu Đoan Kỳ	091456227845	kid14190@gmail.com	$2b$10$L3bVjfyky8P3MRffFAZVWutjYw7qXsC3/gxUjsX5vx17gMV/V8zN6	citizen	t	bf509af8960e3a8a9cf7d2485b5e81b7696e72d1afc89663d24c5f9928badc97	2026-04-09 09:48:13.361+07	2026-04-10 10:06:38.462+07	2000-01-01	0767265062	Nam	Hà Nội	Hà Nội	Số 1 Cầu Giấy, Hà Nội	\N	\N	\N	\N	Việt Nam	2021-05-15	2035-01-01	Cục CS QLHC về TTXH	\N	\N	\N	\N
ccec5a18-1a35-4992-90cc-b6ea39fd4caf	Triệu Đoan Kỳ	12345678910	abc@gmail.com	$2b$10$mnJHFDRLkafpeoWk1ik9a.rZWx9uzdULtosXAmQLjWu8vj8acwR1.	citizen	t	8ac9955c89542227bd03d068a14dddecabd2cd5c215d668486a21d40cb3ce148	2026-04-09 14:21:54.631+07	2026-04-10 10:06:38.462+07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
63489bf3-5713-4aed-a5da-c7b47f7f04ee	Nguyễn Văn B	C82024001	nguyenvanb@bennghe.gov.vn	$2b$10$ktnHbZDzIQ.HDy93Kyt73eKF5KytyflxQBjeebT889RPceLJGkRp2	officer	t	\N	2026-04-10 10:36:09.566+07	2026-04-10 10:36:09.566+07	\N	\N	\N	\N	\N	UBND Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh	\N	\N	\N	\N	\N	\N	\N	\N	C82024001	UBND Phường Bến Nghé	0912345678	Cán bộ tiếp nhận hồ sơ
\.


--
-- TOC entry 5247 (class 2606 OID 19676)
-- Name: ai_logs ai_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT ai_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5251 (class 2606 OID 25411)
-- Name: application_histories application_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT application_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 5147 (class 2606 OID 30961)
-- Name: applications applications_applicationCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key" UNIQUE ("applicationCode");


--
-- TOC entry 5149 (class 2606 OID 30963)
-- Name: applications applications_applicationCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key1" UNIQUE ("applicationCode");


--
-- TOC entry 5151 (class 2606 OID 30975)
-- Name: applications applications_applicationCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key10" UNIQUE ("applicationCode");


--
-- TOC entry 5153 (class 2606 OID 30951)
-- Name: applications applications_applicationCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key11" UNIQUE ("applicationCode");


--
-- TOC entry 5155 (class 2606 OID 30949)
-- Name: applications applications_applicationCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key12" UNIQUE ("applicationCode");


--
-- TOC entry 5157 (class 2606 OID 30977)
-- Name: applications applications_applicationCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key13" UNIQUE ("applicationCode");


--
-- TOC entry 5159 (class 2606 OID 30979)
-- Name: applications applications_applicationCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key14" UNIQUE ("applicationCode");


--
-- TOC entry 5161 (class 2606 OID 30947)
-- Name: applications applications_applicationCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key15" UNIQUE ("applicationCode");


--
-- TOC entry 5163 (class 2606 OID 30945)
-- Name: applications applications_applicationCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key16" UNIQUE ("applicationCode");


--
-- TOC entry 5165 (class 2606 OID 30981)
-- Name: applications applications_applicationCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key17" UNIQUE ("applicationCode");


--
-- TOC entry 5167 (class 2606 OID 30943)
-- Name: applications applications_applicationCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key18" UNIQUE ("applicationCode");


--
-- TOC entry 5169 (class 2606 OID 30941)
-- Name: applications applications_applicationCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key19" UNIQUE ("applicationCode");


--
-- TOC entry 5171 (class 2606 OID 30965)
-- Name: applications applications_applicationCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key2" UNIQUE ("applicationCode");


--
-- TOC entry 5173 (class 2606 OID 30983)
-- Name: applications applications_applicationCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key20" UNIQUE ("applicationCode");


--
-- TOC entry 5175 (class 2606 OID 30939)
-- Name: applications applications_applicationCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key21" UNIQUE ("applicationCode");


--
-- TOC entry 5177 (class 2606 OID 30937)
-- Name: applications applications_applicationCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key22" UNIQUE ("applicationCode");


--
-- TOC entry 5179 (class 2606 OID 30985)
-- Name: applications applications_applicationCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key23" UNIQUE ("applicationCode");


--
-- TOC entry 5181 (class 2606 OID 30935)
-- Name: applications applications_applicationCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key24" UNIQUE ("applicationCode");


--
-- TOC entry 5183 (class 2606 OID 30953)
-- Name: applications applications_applicationCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key25" UNIQUE ("applicationCode");


--
-- TOC entry 5185 (class 2606 OID 30987)
-- Name: applications applications_applicationCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key26" UNIQUE ("applicationCode");


--
-- TOC entry 5187 (class 2606 OID 30933)
-- Name: applications applications_applicationCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key27" UNIQUE ("applicationCode");


--
-- TOC entry 5189 (class 2606 OID 30989)
-- Name: applications applications_applicationCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key28" UNIQUE ("applicationCode");


--
-- TOC entry 5191 (class 2606 OID 30991)
-- Name: applications applications_applicationCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key29" UNIQUE ("applicationCode");


--
-- TOC entry 5193 (class 2606 OID 30959)
-- Name: applications applications_applicationCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key3" UNIQUE ("applicationCode");


--
-- TOC entry 5195 (class 2606 OID 30993)
-- Name: applications applications_applicationCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key30" UNIQUE ("applicationCode");


--
-- TOC entry 5197 (class 2606 OID 30995)
-- Name: applications applications_applicationCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key31" UNIQUE ("applicationCode");


--
-- TOC entry 5199 (class 2606 OID 30931)
-- Name: applications applications_applicationCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key32" UNIQUE ("applicationCode");


--
-- TOC entry 5201 (class 2606 OID 30997)
-- Name: applications applications_applicationCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key33" UNIQUE ("applicationCode");


--
-- TOC entry 5203 (class 2606 OID 30999)
-- Name: applications applications_applicationCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key34" UNIQUE ("applicationCode");


--
-- TOC entry 5205 (class 2606 OID 30929)
-- Name: applications applications_applicationCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key35" UNIQUE ("applicationCode");


--
-- TOC entry 5207 (class 2606 OID 31001)
-- Name: applications applications_applicationCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key36" UNIQUE ("applicationCode");


--
-- TOC entry 5209 (class 2606 OID 31003)
-- Name: applications applications_applicationCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key37" UNIQUE ("applicationCode");


--
-- TOC entry 5211 (class 2606 OID 30927)
-- Name: applications applications_applicationCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key38" UNIQUE ("applicationCode");


--
-- TOC entry 5213 (class 2606 OID 31005)
-- Name: applications applications_applicationCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key39" UNIQUE ("applicationCode");


--
-- TOC entry 5215 (class 2606 OID 30957)
-- Name: applications applications_applicationCode_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key4" UNIQUE ("applicationCode");


--
-- TOC entry 5217 (class 2606 OID 31007)
-- Name: applications applications_applicationCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key40" UNIQUE ("applicationCode");


--
-- TOC entry 5219 (class 2606 OID 30925)
-- Name: applications applications_applicationCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key41" UNIQUE ("applicationCode");


--
-- TOC entry 5221 (class 2606 OID 30923)
-- Name: applications applications_applicationCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key42" UNIQUE ("applicationCode");


--
-- TOC entry 5223 (class 2606 OID 31009)
-- Name: applications applications_applicationCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key43" UNIQUE ("applicationCode");


--
-- TOC entry 5225 (class 2606 OID 31011)
-- Name: applications applications_applicationCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key44" UNIQUE ("applicationCode");


--
-- TOC entry 5227 (class 2606 OID 30921)
-- Name: applications applications_applicationCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key45" UNIQUE ("applicationCode");


--
-- TOC entry 5229 (class 2606 OID 30967)
-- Name: applications applications_applicationCode_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key5" UNIQUE ("applicationCode");


--
-- TOC entry 5231 (class 2606 OID 30969)
-- Name: applications applications_applicationCode_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key6" UNIQUE ("applicationCode");


--
-- TOC entry 5233 (class 2606 OID 30971)
-- Name: applications applications_applicationCode_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key7" UNIQUE ("applicationCode");


--
-- TOC entry 5235 (class 2606 OID 30955)
-- Name: applications applications_applicationCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key8" UNIQUE ("applicationCode");


--
-- TOC entry 5237 (class 2606 OID 30973)
-- Name: applications applications_applicationCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key9" UNIQUE ("applicationCode");


--
-- TOC entry 5239 (class 2606 OID 19578)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 16713)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5245 (class 2606 OID 19656)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 5241 (class 2606 OID 19609)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5243 (class 2606 OID 19626)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5249 (class 2606 OID 25394)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5145 (class 2606 OID 19549)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 30718)
-- Name: users users_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key UNIQUE (cccd);


--
-- TOC entry 4921 (class 2606 OID 30720)
-- Name: users users_cccd_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key1 UNIQUE (cccd);


--
-- TOC entry 4923 (class 2606 OID 30734)
-- Name: users users_cccd_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key10 UNIQUE (cccd);


--
-- TOC entry 4925 (class 2606 OID 30736)
-- Name: users users_cccd_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key11 UNIQUE (cccd);


--
-- TOC entry 4927 (class 2606 OID 30712)
-- Name: users users_cccd_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key12 UNIQUE (cccd);


--
-- TOC entry 4929 (class 2606 OID 30738)
-- Name: users users_cccd_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key13 UNIQUE (cccd);


--
-- TOC entry 4931 (class 2606 OID 30740)
-- Name: users users_cccd_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key14 UNIQUE (cccd);


--
-- TOC entry 4933 (class 2606 OID 30710)
-- Name: users users_cccd_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key15 UNIQUE (cccd);


--
-- TOC entry 4935 (class 2606 OID 30708)
-- Name: users users_cccd_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key16 UNIQUE (cccd);


--
-- TOC entry 4937 (class 2606 OID 30742)
-- Name: users users_cccd_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key17 UNIQUE (cccd);


--
-- TOC entry 4939 (class 2606 OID 30686)
-- Name: users users_cccd_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key18 UNIQUE (cccd);


--
-- TOC entry 4941 (class 2606 OID 30706)
-- Name: users users_cccd_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key19 UNIQUE (cccd);


--
-- TOC entry 4943 (class 2606 OID 30722)
-- Name: users users_cccd_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key2 UNIQUE (cccd);


--
-- TOC entry 4945 (class 2606 OID 30688)
-- Name: users users_cccd_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key20 UNIQUE (cccd);


--
-- TOC entry 4947 (class 2606 OID 30690)
-- Name: users users_cccd_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key21 UNIQUE (cccd);


--
-- TOC entry 4949 (class 2606 OID 30704)
-- Name: users users_cccd_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key22 UNIQUE (cccd);


--
-- TOC entry 4951 (class 2606 OID 30692)
-- Name: users users_cccd_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key23 UNIQUE (cccd);


--
-- TOC entry 4953 (class 2606 OID 30702)
-- Name: users users_cccd_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key24 UNIQUE (cccd);


--
-- TOC entry 4955 (class 2606 OID 30700)
-- Name: users users_cccd_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key25 UNIQUE (cccd);


--
-- TOC entry 4957 (class 2606 OID 30694)
-- Name: users users_cccd_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key26 UNIQUE (cccd);


--
-- TOC entry 4959 (class 2606 OID 30696)
-- Name: users users_cccd_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key27 UNIQUE (cccd);


--
-- TOC entry 4961 (class 2606 OID 30698)
-- Name: users users_cccd_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key28 UNIQUE (cccd);


--
-- TOC entry 4963 (class 2606 OID 30744)
-- Name: users users_cccd_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key29 UNIQUE (cccd);


--
-- TOC entry 4965 (class 2606 OID 30724)
-- Name: users users_cccd_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key3 UNIQUE (cccd);


--
-- TOC entry 4967 (class 2606 OID 30746)
-- Name: users users_cccd_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key30 UNIQUE (cccd);


--
-- TOC entry 4969 (class 2606 OID 30748)
-- Name: users users_cccd_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key31 UNIQUE (cccd);


--
-- TOC entry 4971 (class 2606 OID 30684)
-- Name: users users_cccd_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key32 UNIQUE (cccd);


--
-- TOC entry 4973 (class 2606 OID 30750)
-- Name: users users_cccd_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key33 UNIQUE (cccd);


--
-- TOC entry 4975 (class 2606 OID 30752)
-- Name: users users_cccd_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key34 UNIQUE (cccd);


--
-- TOC entry 4977 (class 2606 OID 30682)
-- Name: users users_cccd_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key35 UNIQUE (cccd);


--
-- TOC entry 4979 (class 2606 OID 30754)
-- Name: users users_cccd_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key36 UNIQUE (cccd);


--
-- TOC entry 4981 (class 2606 OID 30756)
-- Name: users users_cccd_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key37 UNIQUE (cccd);


--
-- TOC entry 4983 (class 2606 OID 30680)
-- Name: users users_cccd_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key38 UNIQUE (cccd);


--
-- TOC entry 4985 (class 2606 OID 30758)
-- Name: users users_cccd_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key39 UNIQUE (cccd);


--
-- TOC entry 4987 (class 2606 OID 30716)
-- Name: users users_cccd_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key4 UNIQUE (cccd);


--
-- TOC entry 4989 (class 2606 OID 30760)
-- Name: users users_cccd_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key40 UNIQUE (cccd);


--
-- TOC entry 4991 (class 2606 OID 30678)
-- Name: users users_cccd_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key41 UNIQUE (cccd);


--
-- TOC entry 4993 (class 2606 OID 30676)
-- Name: users users_cccd_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key42 UNIQUE (cccd);


--
-- TOC entry 4995 (class 2606 OID 30674)
-- Name: users users_cccd_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key43 UNIQUE (cccd);


--
-- TOC entry 4997 (class 2606 OID 30762)
-- Name: users users_cccd_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key44 UNIQUE (cccd);


--
-- TOC entry 4999 (class 2606 OID 30672)
-- Name: users users_cccd_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key45 UNIQUE (cccd);


--
-- TOC entry 5001 (class 2606 OID 30726)
-- Name: users users_cccd_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key5 UNIQUE (cccd);


--
-- TOC entry 5003 (class 2606 OID 30728)
-- Name: users users_cccd_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key6 UNIQUE (cccd);


--
-- TOC entry 5005 (class 2606 OID 30730)
-- Name: users users_cccd_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key7 UNIQUE (cccd);


--
-- TOC entry 5007 (class 2606 OID 30714)
-- Name: users users_cccd_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key8 UNIQUE (cccd);


--
-- TOC entry 5009 (class 2606 OID 30732)
-- Name: users users_cccd_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key9 UNIQUE (cccd);


--
-- TOC entry 5011 (class 2606 OID 30783)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5013 (class 2606 OID 30785)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 5015 (class 2606 OID 30807)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 5017 (class 2606 OID 30809)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 5019 (class 2606 OID 30835)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 5021 (class 2606 OID 30811)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 5023 (class 2606 OID 30813)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 5025 (class 2606 OID 30833)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 5027 (class 2606 OID 30831)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 5029 (class 2606 OID 30815)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 5031 (class 2606 OID 30817)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 5033 (class 2606 OID 30829)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 5035 (class 2606 OID 30795)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 5037 (class 2606 OID 30825)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 5039 (class 2606 OID 30827)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 5041 (class 2606 OID 30823)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 5043 (class 2606 OID 30819)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 5045 (class 2606 OID 30821)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 5047 (class 2606 OID 30793)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 5049 (class 2606 OID 30787)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 5051 (class 2606 OID 30789)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 5053 (class 2606 OID 30791)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 5055 (class 2606 OID 30837)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 5057 (class 2606 OID 30797)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 5059 (class 2606 OID 30839)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 5061 (class 2606 OID 30841)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 5063 (class 2606 OID 30777)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 5065 (class 2606 OID 30843)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 5067 (class 2606 OID 30845)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 5069 (class 2606 OID 30775)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 5071 (class 2606 OID 30847)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 5073 (class 2606 OID 30849)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 5075 (class 2606 OID 30773)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 5077 (class 2606 OID 30851)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 5079 (class 2606 OID 30781)
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- TOC entry 5081 (class 2606 OID 30853)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 5083 (class 2606 OID 30771)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 5085 (class 2606 OID 30769)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 5087 (class 2606 OID 30855)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 5089 (class 2606 OID 30857)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 5091 (class 2606 OID 30767)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 5093 (class 2606 OID 30799)
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- TOC entry 5095 (class 2606 OID 30801)
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- TOC entry 5097 (class 2606 OID 30803)
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- TOC entry 5099 (class 2606 OID 30779)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 5101 (class 2606 OID 30805)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 5103 (class 2606 OID 30883)
-- Name: users users_officerCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key" UNIQUE ("officerCode");


--
-- TOC entry 5105 (class 2606 OID 30881)
-- Name: users users_officerCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key1" UNIQUE ("officerCode");


--
-- TOC entry 5107 (class 2606 OID 30897)
-- Name: users users_officerCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key10" UNIQUE ("officerCode");


--
-- TOC entry 5109 (class 2606 OID 30899)
-- Name: users users_officerCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key11" UNIQUE ("officerCode");


--
-- TOC entry 5111 (class 2606 OID 30875)
-- Name: users users_officerCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key12" UNIQUE ("officerCode");


--
-- TOC entry 5113 (class 2606 OID 30901)
-- Name: users users_officerCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key13" UNIQUE ("officerCode");


--
-- TOC entry 5115 (class 2606 OID 30903)
-- Name: users users_officerCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key14" UNIQUE ("officerCode");


--
-- TOC entry 5117 (class 2606 OID 30873)
-- Name: users users_officerCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key15" UNIQUE ("officerCode");


--
-- TOC entry 5119 (class 2606 OID 30871)
-- Name: users users_officerCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key16" UNIQUE ("officerCode");


--
-- TOC entry 5121 (class 2606 OID 30905)
-- Name: users users_officerCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key17" UNIQUE ("officerCode");


--
-- TOC entry 5123 (class 2606 OID 30907)
-- Name: users users_officerCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key18" UNIQUE ("officerCode");


--
-- TOC entry 5125 (class 2606 OID 30869)
-- Name: users users_officerCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key19" UNIQUE ("officerCode");


--
-- TOC entry 5127 (class 2606 OID 30885)
-- Name: users users_officerCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key2" UNIQUE ("officerCode");


--
-- TOC entry 5129 (class 2606 OID 30887)
-- Name: users users_officerCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key3" UNIQUE ("officerCode");


--
-- TOC entry 5131 (class 2606 OID 30889)
-- Name: users users_officerCode_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key4" UNIQUE ("officerCode");


--
-- TOC entry 5133 (class 2606 OID 30891)
-- Name: users users_officerCode_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key5" UNIQUE ("officerCode");


--
-- TOC entry 5135 (class 2606 OID 30879)
-- Name: users users_officerCode_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key6" UNIQUE ("officerCode");


--
-- TOC entry 5137 (class 2606 OID 30893)
-- Name: users users_officerCode_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key7" UNIQUE ("officerCode");


--
-- TOC entry 5139 (class 2606 OID 30895)
-- Name: users users_officerCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key8" UNIQUE ("officerCode");


--
-- TOC entry 5141 (class 2606 OID 30877)
-- Name: users users_officerCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key9" UNIQUE ("officerCode");


--
-- TOC entry 5143 (class 2606 OID 19530)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 1259 OID 16720)
-- Name: idx_audit_hanh_dong; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_hanh_dong ON public.audit_logs USING btree (hanh_dong);


--
-- TOC entry 4916 (class 1259 OID 16719)
-- Name: idx_audit_nguoi_dung; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_nguoi_dung ON public.audit_logs USING btree (nguoi_dung_id);


--
-- TOC entry 4917 (class 1259 OID 16721)
-- Name: idx_audit_thoi_gian; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_thoi_gian ON public.audit_logs USING btree (thoi_gian);


--
-- TOC entry 5261 (class 2606 OID 31094)
-- Name: application_histories application_histories_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5262 (class 2606 OID 31089)
-- Name: application_histories application_histories_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5252 (class 2606 OID 31022)
-- Name: applications applications_officerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5253 (class 2606 OID 31017)
-- Name: applications applications_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5254 (class 2606 OID 31012)
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5258 (class 2606 OID 31058)
-- Name: comments comments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5259 (class 2606 OID 31063)
-- Name: comments comments_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5255 (class 2606 OID 31033)
-- Name: documents documents_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5256 (class 2606 OID 31049)
-- Name: notifications notifications_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE;


--
-- TOC entry 5257 (class 2606 OID 31044)
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5260 (class 2606 OID 31075)
-- Name: schedules schedules_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-04-12 21:28:38

--
-- PostgreSQL database dump complete
--

\unrestrict advx8gXYYHt41ygeO7PBnXGN5NORDnG6EaLrvAfPCaIPhCYktDaU09LHUx86uTv

