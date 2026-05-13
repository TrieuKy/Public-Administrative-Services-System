--
-- PostgreSQL database dump
--

\restrict btsAlahNrDGusawZc9tCLDE3QMP6Bfi7FOgv2NpnB1Pxr0kOZdSj53fdLcsadnW

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-13 11:30:22

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
-- TOC entry 5931 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 963 (class 1247 OID 65040)
-- Name: enum_applications_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_applications_paymentStatus" AS ENUM (
    'FREE',
    'UNPAID',
    'PAID'
);


ALTER TYPE public."enum_applications_paymentStatus" OWNER TO postgres;

--
-- TOC entry 921 (class 1247 OID 37181)
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
-- TOC entry 960 (class 1247 OID 44810)
-- Name: enum_comments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_comments_status AS ENUM (
    'pending',
    'resolved',
    'dismissed'
);


ALTER TYPE public.enum_comments_status OWNER TO postgres;

--
-- TOC entry 933 (class 1247 OID 37268)
-- Name: enum_comments_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_comments_type AS ENUM (
    'internal',
    'public',
    'feedback'
);


ALTER TYPE public.enum_comments_type OWNER TO postgres;

--
-- TOC entry 954 (class 1247 OID 44455)
-- Name: enum_payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payments_status AS ENUM (
    'pending',
    'success',
    'failed',
    'refunded'
);


ALTER TYPE public.enum_payments_status OWNER TO postgres;

--
-- TOC entry 948 (class 1247 OID 37351)
-- Name: enum_posts_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_posts_category AS ENUM (
    'Tin tức',
    'Hướng dẫn',
    'Thông báo'
);


ALTER TYPE public.enum_posts_category OWNER TO postgres;

--
-- TOC entry 912 (class 1247 OID 25374)
-- Name: enum_schedules_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_priority AS ENUM (
    'normal',
    'urgent'
);


ALTER TYPE public.enum_schedules_priority OWNER TO postgres;

--
-- TOC entry 909 (class 1247 OID 25366)
-- Name: enum_schedules_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_schedules_status OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 19509)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'citizen',
    'officer',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 16470)
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
-- TOC entry 885 (class 1247 OID 16422)
-- Name: kenh_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kenh_enum AS ENUM (
    'EMAIL',
    'SMS',
    'IN_APP'
);


ALTER TYPE public.kenh_enum OWNER TO postgres;

--
-- TOC entry 897 (class 1247 OID 16460)
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
-- TOC entry 894 (class 1247 OID 16454)
-- Name: loai_cmt_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_cmt_enum AS ENUM (
    'INTERNAL',
    'FEEDBACK'
);


ALTER TYPE public.loai_cmt_enum OWNER TO postgres;

--
-- TOC entry 891 (class 1247 OID 16444)
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
-- TOC entry 888 (class 1247 OID 16430)
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
-- TOC entry 882 (class 1247 OID 16408)
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
-- TOC entry 879 (class 1247 OID 16401)
-- Name: vai_tro_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vai_tro_enum AS ENUM (
    'CITIZEN',
    'OFFICER',
    'ADMIN'
);


ALTER TYPE public.vai_tro_enum OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 16722)
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
-- TOC entry 246 (class 1255 OID 16729)
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
-- TOC entry 245 (class 1255 OID 16727)
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
-- TOC entry 229 (class 1259 OID 37297)
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
    "updatedAt" timestamp with time zone NOT NULL,
    "modelName" character varying(100)
);


ALTER TABLE public.ai_logs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 37328)
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
-- TOC entry 225 (class 1259 OID 37195)
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
    deadline timestamp with time zone,
    rating integer,
    "ratingContent" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "paymentStatus" public."enum_applications_paymentStatus" DEFAULT 'FREE'::public."enum_applications_paymentStatus",
    "paymentCode" character varying(255),
    copies integer DEFAULT 1,
    "feeTotal" integer DEFAULT 0
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
-- TOC entry 228 (class 1259 OID 37273)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    "authorId" uuid NOT NULL,
    content text NOT NULL,
    type public.enum_comments_type DEFAULT 'internal'::public.enum_comments_type,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    topic character varying(255),
    title character varying(255),
    status public.enum_comments_status DEFAULT 'pending'::public.enum_comments_status
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 37226)
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
    "updatedAt" timestamp with time zone NOT NULL,
    "aiData" jsonb
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 37245)
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
    "updatedAt" timestamp with time zone NOT NULL,
    "readAt" timestamp with time zone,
    category character varying(50) DEFAULT 'APPLICATION'::character varying
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 44463)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    "receiptCode" character varying(30) NOT NULL,
    "applicationId" uuid,
    "userId" uuid NOT NULL,
    "feeType" character varying(200) NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    "paymentMethod" character varying(50) DEFAULT 'card'::character varying,
    status public.enum_payments_status DEFAULT 'pending'::public.enum_payments_status,
    "paidAt" timestamp with time zone,
    note text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 37357)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    excerpt text,
    content text,
    "imageUrl" character varying(255),
    category public.enum_posts_category DEFAULT 'Tin tức'::public.enum_posts_category,
    "isPublished" boolean DEFAULT false,
    "publishedAt" timestamp with time zone,
    "authorId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 37307)
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
-- TOC entry 224 (class 1259 OID 37161)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    description text,
    agency character varying(255) DEFAULT 'Ủy ban nhân dân cấp xã'::character varying,
    "processingTime" character varying(255) DEFAULT '5 ngày làm việc'::character varying,
    "processingDays" integer DEFAULT 5,
    level character varying(255) DEFAULT 'Mức độ 4'::character varying,
    fee character varying(255) DEFAULT 'Miễn phí'::character varying,
    "requiredDocs" jsonb DEFAULT '[]'::jsonb,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "currentFee" integer DEFAULT 0
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 37139)
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
    "position" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5921 (class 0 OID 37297)
-- Dependencies: 229
-- Data for Name: ai_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_logs (id, "applicationId", type, input, output, confidence, "durationMs", "createdAt", "updatedAt", "modelName") FROM stdin;
\.


--
-- TOC entry 5923 (class 0 OID 37328)
-- Dependencies: 231
-- Data for Name: application_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_histories (id, "applicationId", "actorId", action, note, "createdAt", "updatedAt") FROM stdin;
7ba2456d-086b-4e43-9658-2d2bf8fd4f0d	e508e868-2681-496f-9969-c6dd22c1f963	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-04-14 13:23:00.086+07	2026-04-14 13:23:00.086+07
49a83ee7-8f77-415a-8e8a-937a17f586cd	544cf189-664b-45ab-9d03-cf575ec5da5d	4197d2bc-3f97-4729-8334-230047d5eaf8	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-04-14 13:36:25.061+07	2026-04-14 13:36:25.061+07
2a9c05d1-b310-4e6a-93ee-09efa354aa05	5b12c364-42a1-4596-927d-60ec9baf5e21	4197d2bc-3f97-4729-8334-230047d5eaf8	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-04-22 10:03:49.3+07	2026-04-22 10:03:49.3+07
46ac29be-d2d1-4103-944f-5cde52a5735a	e011db3b-64b5-4cc7-9885-aa66ffaa4197	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-04-22 10:31:18.597+07	2026-04-22 10:31:18.597+07
4d772767-7e02-4883-b37d-4970106107ab	5b12c364-42a1-4596-927d-60ec9baf5e21	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-04-24 08:27:29.669+07	2026-04-24 08:27:29.669+07
1a374f83-f0be-486d-a567-74e78d960213	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	4197d2bc-3f97-4729-8334-230047d5eaf8	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-04 10:17:00.996+07	2026-05-04 10:17:00.996+07
1952e216-0e94-41a6-afbc-9dbf2048022d	8bc481da-abd4-4302-b3ac-fee6466e05d6	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-10 20:39:42.124+07	2026-05-10 20:39:42.124+07
ca216f83-3537-4f60-a923-48a3afb8eec2	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Từ chối hồ sơ	thiếu tin cậy	2026-05-10 20:45:48.972+07	2026-05-10 20:45:48.972+07
43b763e8-94cd-4220-bad6-158e886bbd95	e011db3b-64b5-4cc7-9885-aa66ffaa4197	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Yêu cầu bổ sung	Cần bổ sung: thêm giấy. thêm giấy	2026-05-10 20:46:02.699+07	2026-05-10 20:46:02.699+07
66104124-4120-41fd-8294-b0bdaeb192ed	8bc481da-abd4-4302-b3ac-fee6466e05d6	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-10 20:46:19.45+07	2026-05-10 20:46:19.45+07
1ade6d42-debd-4037-966f-86aecd7b577f	0efd3e1c-f467-4d31-8326-3ade00167f12	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-11 09:32:25.378+07	2026-05-11 09:32:25.378+07
7c288da4-7343-409a-b1c7-82ccf6361ff9	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-11 09:36:58.025+07	2026-05-11 09:36:58.025+07
651812af-affb-4045-95d1-d28a03ccf936	b82a90a7-f864-426b-b6a7-f064104d9443	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-11 09:46:17.585+07	2026-05-11 09:46:17.585+07
2245d177-f88a-4243-b5d6-c6121e22d323	49b2d779-0f1a-41c7-bf50-c66bc0ded437	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-11 09:47:52.829+07	2026-05-11 09:47:52.829+07
8e83a803-b2a3-4924-9c44-bf5f7c29c37d	b2aa413e-f832-4b46-9716-92f2c4b89057	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-11 09:54:32.849+07	2026-05-11 09:54:32.849+07
79a3067d-c90c-4d10-a23b-f1e46c3eb3c6	b82a90a7-f864-426b-b6a7-f064104d9443	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-11 09:55:44.662+07	2026-05-11 09:55:44.662+07
\.


--
-- TOC entry 5917 (class 0 OID 37195)
-- Dependencies: 225
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, "applicationCode", "userId", "serviceId", "officerId", "formData", status, "cancelReason", "rejectReason", "officerNote", "submittedAt", "completedAt", deadline, rating, "ratingContent", "createdAt", "updatedAt", "paymentStatus", "paymentCode", copies, "feeTotal") FROM stdin;
0efd3e1c-f467-4d31-8326-3ade00167f12	HS-2026-000007	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	\N	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "NGUYỄN NGỌC", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOAN KỲ", "idNumber": "094205001245", "soHoKhau": "571165430", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiThuongTru": "[không rõ]", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	PENDING	\N	\N	\N	2026-05-11 09:32:25.374+07	\N	2026-05-12 09:32:25.374+07	\N	\N	2026-05-11 09:32:25.075+07	2026-05-11 09:32:25.375+07	FREE	\N	1	0
e508e868-2681-496f-9969-c6dd22c1f963	HS-2026-000001	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	9bb9280a-e545-4853-934b-e582b504904b	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "nguyenhuyhoang@gmail.com", "phone": "0955384639", "fullName": "Nguyễn Huy Hoàng", "idNumber": "0978367829"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-14 13:23:00.081+07	2026-04-14 13:23:40.178+07	2026-04-16 13:23:00.081+07	\N	\N	2026-04-14 13:22:59.967+07	2026-04-14 13:23:40.179+07	FREE	\N	1	0
4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	HS-2026-000008	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	\N	{"dob": "1985-03-12", "cccd": "36227097076416", "email": "", "phone": "0767265062", "danToc": "Kinh", "gender": "Nam", "soBHXH": "7910002781", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "kinhGui": "Trung tâm Dịch vụ việc làm thành phố Hồ Chí Minh", "tonGiao": "Không", "fullName": "TRIỆU DOÃN KỲ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "nganHang": "Ngân hàng Đông Á", "issueDate": "2020-01-30", "noiLapDon": "Tp. Hồ Chí Minh", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "ngayLapDon": "2026-05-10", "ngheNghiep": "Công nhân", "noiLamViec": "Công ty TNHH ABC", "soTaiKhoan": "1234567890", "choOHienNay": "Như trên", "nationality": "Việt Nam", "phoneNumber": "0902388187", "noiThuongTru": "123 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP.HCM", "issueDateCCCD": "2008-01-23", "loaiHinhDonVi": "Doanh nghiệp (nhà nước)", "issuePlaceCCCD": "Công an tỉnh", "ngayChamDutHDLD": "2026-04-30", "thoiGianDongBHTN": "12 tháng", "trinhDoChuyenMon": "Không có bằng cấp, chứng chỉ", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "nguyenNhanChamDutHDLD": "Hết hạn HĐLĐ/HĐLV", "noiDangKyKhamChuaBenh": "Bệnh viện Quận 1", "viTriCongViecTruocThatNghiep": "Lao động phổ thông"}	PENDING	\N	\N	\N	2026-05-11 09:36:58.022+07	\N	2026-05-12 09:36:58.022+07	\N	\N	2026-05-11 09:36:57.766+07	2026-05-11 09:36:58.022+07	FREE	\N	1	0
544cf189-664b-45ab-9d03-cf575ec5da5d	HS-2026-000002	4197d2bc-3f97-4729-8334-230047d5eaf8	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "kid14190@gmail.com", "phone": "0988888777", "fullName": "ABC", "idNumber": "1111111111"}	REJECTED	\N	ko	Duyệt thành công	2026-04-14 13:36:25.052+07	2026-04-14 13:36:42.013+07	2026-04-15 13:36:25.052+07	\N	\N	2026-04-14 13:36:24.921+07	2026-04-14 13:37:07.018+07	FREE	\N	1	0
5b12c364-42a1-4596-927d-60ec9baf5e21	HS-2026-000003	4197d2bc-3f97-4729-8334-230047d5eaf8	dc6bae36-43b2-4d9e-b217-81dacec10953	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "kid14190@gmail.com", "phone": "09687463829", "fullName": "Triệu Đoan Kỳ", "idNumber": "094205001245"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-22 10:03:49.291+07	2026-04-24 08:27:29.649+07	2026-04-23 10:03:49.291+07	\N	\N	2026-04-22 10:03:49.149+07	2026-04-24 08:27:29.652+07	FREE	\N	1	0
49b2d779-0f1a-41c7-bf50-c66bc0ded437	HS-2026-000010	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	\N	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "NGUYỄN NGỌC", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOÃN KỲ", "idNumber": "094205001245", "soHoKhau": "571165430", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	PENDING	\N	\N	\N	2026-05-11 09:47:52.825+07	\N	2026-05-12 09:47:52.825+07	\N	\N	2026-05-11 09:47:52.559+07	2026-05-11 09:47:52.825+07	FREE	\N	1	0
adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	HS-2026-000005	4197d2bc-3f97-4729-8334-230047d5eaf8	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "citizen@example.com", "phone": "0901234567", "fullName": "Trần Thị Công Dân", "idNumber": "079200012345"}	REJECTED	\N	thiếu tin cậy	\N	2026-05-04 10:17:00.986+07	\N	2026-05-05 10:17:00.986+07	\N	\N	2026-05-04 10:17:00.819+07	2026-05-10 20:45:48.966+07	FREE	\N	1	0
e011db3b-64b5-4cc7-9885-aa66ffaa4197	HS-2026-000004	2688bdb5-bf12-447d-98da-de41be9af9c2	e0a41035-c7f1-4f07-a266-d3a1d318a3eb	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "trieukyst5678@gmail.com", "phone": "63543543534", "fullName": "Triệu Đoan Kỳ", "idNumber": "094205001245"}	NEED_MORE	\N	\N	\N	2026-04-22 10:31:18.592+07	\N	2026-04-25 10:31:18.592+07	\N	\N	2026-04-22 10:31:18.453+07	2026-05-10 20:46:02.694+07	FREE	\N	1	0
8bc481da-abd4-4302-b3ac-fee6466e05d6	HS-2026-000006	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "MAI VIỆT DŨNG", "email": "", "phone": "0977474837", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOÃN KỲ", "hometown": "Việt Nam", "idNumber": "094205001245", "soHoKhau": "240415174", "cmndChuHo": "013319049", "issueDate": "2020-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiChuyenDen": "Thanh Bù", "noiThuongTru": "Số 80 P. Mai Dịch Q. Cầu Giấy", "ngayChuyenDen": "2009-12-08", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-10 20:39:42.118+07	2026-05-10 20:46:19.443+07	2026-05-11 20:39:42.118+07	\N	\N	2026-05-10 20:39:41.991+07	2026-05-10 20:46:19.443+07	FREE	\N	1	0
b2aa413e-f832-4b46-9716-92f2c4b89057	HS-2026-000011	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	\N	{"dob": "1989-07-23", "cccd": "362279997.076.416", "email": "", "phone": "0767265062", "gender": "Nữ", "soBHXH": "7915040578", "address": "Nhơn Nghĩa, Phong Điền, TP. Cần Thơ", "bankName": "Đông Á", "fullName": "[không rõ]", "idNumber": "362279997.076.416", "religion": "Không", "ethnicity": "Kinh", "issueDate": "2008-08-25", "issuePlace": "Cần Thơ", "signerName": "[không rõ]", "phoneNumber": "0903338187", "documentDate": "[không rõ]", "employerName": "[không rõ]", "currentAddress": "[không rõ]", "terminationDate": "[không rõ]", "bankAccountNumber": "[không rõ]", "medicalRegistrationPlace": "[không rõ]"}	PENDING	\N	\N	\N	2026-05-11 09:54:32.842+07	\N	2026-05-12 09:54:32.842+07	\N	\N	2026-05-11 09:54:32.529+07	2026-05-11 09:54:32.843+07	FREE	\N	1	0
b82a90a7-f864-426b-b6a7-f064104d9443	HS-2026-000009	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "danToc": "Kinh", "gender": "Nam", "soBHXH": "7912050271", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "tonGiao": "Không", "fullName": "Triệu Đoàn Kỳ", "hometown": "Việt Nam", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "ngayLamDon": "[không rõ]", "soTaiKhoan": "tại ngân hàng Đông Á", "nationality": "Việt Nam", "phoneNumber": "0902188187", "loaiHinhDonVi": "Đơn vị sự nghiệp công lập", "thoiGianDongBHTN": "3 tháng", "trinhDoChuyenMon": "Không có bằng cấp, chứng chỉ", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "issueDate_cccd_form": "2026-01-30", "issuePlace_cccd_form": "Cần Thơ", "noiDangKyKhamChuaBenh": "[không rõ]", "viTriCongViecTruocThatNghiep": "Lãnh đạo"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-11 09:46:17.579+07	2026-05-11 09:55:44.657+07	2026-05-12 09:46:17.579+07	\N	\N	2026-05-11 09:46:17.331+07	2026-05-11 09:55:44.657+07	FREE	\N	1	0
\.


--
-- TOC entry 5914 (class 0 OID 16701)
-- Dependencies: 222
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, nguoi_dung_id, ho_so_id, bang_lien_quan, ban_ghi_id, hanh_dong, du_lieu_cu, du_lieu_moi, dia_chi_ip, user_agent, thoi_gian) FROM stdin;
\.


--
-- TOC entry 5920 (class 0 OID 37273)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, "applicationId", "authorId", content, type, "createdAt", "updatedAt", topic, title, status) FROM stdin;
\.


--
-- TOC entry 5918 (class 0 OID 37226)
-- Dependencies: 226
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, "applicationId", "docType", "fileName", "fileUrl", "filePath", "mimeType", "fileSize", "isSupplement", "aiStatus", "createdAt", "updatedAt", "aiData") FROM stdin;
906d1c9b-20ae-4790-9dde-32b18974ebff	e508e868-2681-496f-9969-c6dd22c1f963	Tài liệu bắt buộc	xin xÃÂ¡c nhÃ¡Âº_n cÃÂ° trÃÂº.jpg	/uploads/1776147780013-479399965.jpg	uploads\\1776147780013-479399965.jpg	image/jpeg	677	f	\N	2026-04-14 13:23:00.038+07	2026-04-14 13:23:00.038+07	\N
d0845632-89e4-4af4-8887-f331e504a848	e508e868-2681-496f-9969-c6dd22c1f963	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776147780054-96062566.png	uploads\\1776147780054-96062566.png	image/png	677	f	\N	2026-04-14 13:23:00.058+07	2026-04-14 13:23:00.058+07	\N
6d5b9b24-58f0-4d7a-b08e-c768ff0d3b69	544cf189-664b-45ab-9d03-cf575ec5da5d	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776148584989-331391443.png	uploads\\1776148584989-331391443.png	image/png	677	f	\N	2026-04-14 13:36:25.003+07	2026-04-14 13:36:25.003+07	\N
84845d08-f1eb-4945-a4be-14d53a1ef49e	544cf189-664b-45ab-9d03-cf575ec5da5d	Tài liệu bắt buộc	xin xÃÂ¡c nhÃ¡Âº_n cÃÂ° trÃÂº.jpg	/uploads/1776148585018-584721854.jpg	uploads\\1776148585018-584721854.jpg	image/jpeg	677	f	\N	2026-04-14 13:36:25.024+07	2026-04-14 13:36:25.024+07	\N
144f1b51-3b81-4cdb-bdbc-630d39fb5199	5b12c364-42a1-4596-927d-60ec9baf5e21	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776827029206-512518373.png	uploads\\1776827029206-512518373.png	image/png	3317756	f	\N	2026-04-22 10:03:49.245+07	2026-04-22 10:03:49.245+07	\N
405d1970-b100-453e-8ad5-8440c7779bdb	5b12c364-42a1-4596-927d-60ec9baf5e21	Tài liệu bắt buộc	CCCD front.jpg	/uploads/1776827029255-840958072.jpg	uploads\\1776827029255-840958072.jpg	image/jpeg	1133306	f	\N	2026-04-22 10:03:49.274+07	2026-04-22 10:03:49.274+07	\N
f43a109a-d786-4a46-9680-68214485b89c	e011db3b-64b5-4cc7-9885-aa66ffaa4197	Giấy chứng sinh	don-xin-bhtn.png	/uploads/1776828678503-734291455.png	uploads\\1776828678503-734291455.png	image/png	3317756	f	\N	2026-04-22 10:31:18.531+07	2026-04-22 10:31:18.531+07	\N
ac649465-8ecd-4a23-92f2-fae7d1346076	e011db3b-64b5-4cc7-9885-aa66ffaa4197	CMND/CCCD cha mẹ	xin xÃ¡c nháº­n cÆ° trÃº.jpg	/uploads/1776828678538-626360444.jpg	uploads\\1776828678538-626360444.jpg	image/jpeg	70091	f	\N	2026-04-22 10:31:18.543+07	2026-04-22 10:31:18.543+07	\N
bfc7564b-d62b-4fa2-ab0b-ca378ae0c53b	e011db3b-64b5-4cc7-9885-aa66ffaa4197	Giấy đăng ký kết hôn	CCCD Back.jpg	/uploads/1776828678553-930925007.jpg	uploads\\1776828678553-930925007.jpg	image/jpeg	1355301	f	\N	2026-04-22 10:31:18.564+07	2026-04-22 10:31:18.564+07	\N
dc11c4ac-4372-4833-9098-bad9be0006df	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	Bản gốc cần chứng thực	CCCD Front.jpg	/uploads/1777864620921-707740596.jpg	uploads\\1777864620921-707740596.jpg	image/jpeg	1420794	f	\N	2026-05-04 10:17:00.94+07	2026-05-04 10:17:00.94+07	\N
325286f7-8ec0-4110-b475-97fc0b5761db	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	CMND/CCCD người yêu cầu	Sá» há» kháº©u.jpg	/uploads/1777864620954-244080189.jpg	uploads\\1777864620954-244080189.jpg	image/jpeg	85685	f	\N	2026-05-04 10:17:00.959+07	2026-05-04 10:17:00.959+07	\N
2bd499ec-1d5b-4057-be66-39aed38b4aaa	8bc481da-abd4-4302-b3ac-fee6466e05d6	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778420382075-101219984.jpg	uploads\\1778420382075-101219984.jpg	image/jpeg	1420794	f	\N	2026-05-10 20:39:42.084+07	2026-05-10 20:39:42.084+07	\N
be11172d-332d-441a-9b45-ea0bb6f8627f	8bc481da-abd4-4302-b3ac-fee6466e05d6	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778420382091-215483116.jpg	uploads\\1778420382091-215483116.jpg	image/jpeg	1355301	f	\N	2026-05-10 20:39:42.097+07	2026-05-10 20:39:42.097+07	\N
e4f2d6fb-5a68-4f90-aac4-9c38c0d17998	8bc481da-abd4-4302-b3ac-fee6466e05d6	SỔ hộ khẩu.jpg	Sá» há» kháº©u.jpg	/uploads/1778420382103-329134402.jpg	uploads\\1778420382103-329134402.jpg	image/jpeg	85685	f	\N	2026-05-10 20:39:42.106+07	2026-05-10 20:39:42.106+07	\N
a108546b-9ac3-4490-aff5-82eb9c6b8949	0efd3e1c-f467-4d31-8326-3ade00167f12	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778466745269-56828446.jpg	uploads\\1778466745269-56828446.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:32:25.289+07	2026-05-11 09:32:25.289+07	\N
14fedc39-0d49-496c-b6f5-d8bc99bd77f2	0efd3e1c-f467-4d31-8326-3ade00167f12	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778466745300-506587513.jpg	uploads\\1778466745300-506587513.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:32:25.319+07	2026-05-11 09:32:25.319+07	\N
05494b2d-c1bd-405b-be69-46e8a5afd74a	0efd3e1c-f467-4d31-8326-3ade00167f12	Sổ hộ khẩu (1).jpg	Sá» há» kháº©u (1).jpg	/uploads/1778466745331-296769711.jpg	uploads\\1778466745331-296769711.jpg	image/jpeg	132544	f	\N	2026-05-11 09:32:25.337+07	2026-05-11 09:32:25.337+07	\N
65819a98-981f-4f25-9c4b-57031cd7dae5	0efd3e1c-f467-4d31-8326-3ade00167f12	Sổ hộ khẩu (2).jpg	Sá» há» kháº©u (2).jpg	/uploads/1778466745346-266899890.jpg	uploads\\1778466745346-266899890.jpg	image/jpeg	56792	f	\N	2026-05-11 09:32:25.351+07	2026-05-11 09:32:25.351+07	\N
0db1fc8c-2867-4ec4-ba50-cbd1a3a6f9f1	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467017908-56821228.jpg	uploads\\1778467017908-56821228.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:36:57.929+07	2026-05-11 09:36:57.929+07	\N
320136af-365d-488e-90e8-6d26e627dc86	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467017944-345803508.jpg	uploads\\1778467017944-345803508.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:36:57.96+07	2026-05-11 09:36:57.96+07	\N
2288af01-d1f1-4aa7-8771-521bd32ddecd	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778467017970-755303930.png	uploads\\1778467017970-755303930.png	image/png	3317756	f	\N	2026-05-11 09:36:58.002+07	2026-05-11 09:36:58.002+07	\N
b2f082d3-17d7-477c-b593-03c78300a8f8	b82a90a7-f864-426b-b6a7-f064104d9443	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778467577468-572046887.png	uploads\\1778467577468-572046887.png	image/png	3317756	f	\N	2026-05-11 09:46:17.493+07	2026-05-11 09:46:17.493+07	\N
9095bb4c-5eda-42a6-ab64-0b5ca219a14b	b82a90a7-f864-426b-b6a7-f064104d9443	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467577509-361637444.jpg	uploads\\1778467577509-361637444.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:46:17.529+07	2026-05-11 09:46:17.529+07	\N
6ee0ebab-d140-4a97-b662-122cb1805810	b82a90a7-f864-426b-b6a7-f064104d9443	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467577540-335250808.jpg	uploads\\1778467577540-335250808.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:46:17.556+07	2026-05-11 09:46:17.556+07	\N
c60114bc-e36a-4817-a322-b2ca92fdec10	49b2d779-0f1a-41c7-bf50-c66bc0ded437	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467672713-157635834.jpg	uploads\\1778467672713-157635834.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:47:52.734+07	2026-05-11 09:47:52.734+07	\N
21a98a9a-29c5-4bf7-9ca1-b88d86020a9f	49b2d779-0f1a-41c7-bf50-c66bc0ded437	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467672749-633400591.jpg	uploads\\1778467672749-633400591.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:47:52.768+07	2026-05-11 09:47:52.768+07	\N
f6f42476-7b4b-458f-87e7-e35106b924a3	49b2d779-0f1a-41c7-bf50-c66bc0ded437	Sổ hộ khẩu (1).jpg	Sá» há» kháº©u (1).jpg	/uploads/1778467672781-929121662.jpg	uploads\\1778467672781-929121662.jpg	image/jpeg	132544	f	\N	2026-05-11 09:47:52.786+07	2026-05-11 09:47:52.786+07	\N
8ab5132c-741a-45d7-977f-8ba7059e21a6	49b2d779-0f1a-41c7-bf50-c66bc0ded437	Sổ hộ khẩu (2).jpg	Sá» há» kháº©u (2).jpg	/uploads/1778467672798-28918658.jpg	uploads\\1778467672798-28918658.jpg	image/jpeg	56792	f	\N	2026-05-11 09:47:52.802+07	2026-05-11 09:47:52.802+07	\N
63857cdd-3aff-472f-9252-9dd8b7290826	b2aa413e-f832-4b46-9716-92f2c4b89057	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778468072785-691602084.png	uploads\\1778468072785-691602084.png	image/png	3317756	f	\N	2026-05-11 09:54:32.814+07	2026-05-11 09:54:32.814+07	\N
\.


--
-- TOC entry 5919 (class 0 OID 37245)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", "applicationId", type, title, message, "isRead", "emailSentAt", "createdAt", "updatedAt", "readAt", category) FROM stdin;
\.


--
-- TOC entry 5925 (class 0 OID 44463)
-- Dependencies: 233
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "receiptCode", "applicationId", "userId", "feeType", amount, "paymentMethod", status, "paidAt", note, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5924 (class 0 OID 37357)
-- Dependencies: 232
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, excerpt, content, "imageUrl", category, "isPublished", "publishedAt", "authorId", "createdAt", "updatedAt") FROM stdin;
72cdeffa-e2ee-4198-8301-a03d7cd5b504	Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0	Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...	Ứng dụng VNeID 2.0 tích hợp xác thực sinh trắc học, bảo hiểm y tế điện tử và ký số trực tuyến. Cập nhật ngay trên App Store và Google Play.	https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600	Tin tức	t	2026-03-28 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
bcda7438-58e0-4a78-95fe-0e6359223ece	Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng	Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...	Truy cập Cổng Dịch vụ Công, điền thông tin, tải hồ sơ và ký số. Không cần đến trực tiếp UBND.	https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600	Hướng dẫn	t	2026-03-25 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
42ddda4a-5e19-4780-a924-6b883e744f6b	Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00	Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...	Cổng DỊCH VỤ CÔNG tạm ngưng từ 22h00 ngày 05/04 đến 02h00 ngày 06/04 để bảo trì.	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600	Thông báo	t	2026-03-22 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
407f7ae4-7a18-4086-b834-81fb0ce1e931	Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4	Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...	500 dịch vụ công cấp độ 4 toàn trình, không cần bản giấy — bước tiến chuyển đổi số 2025-2030.	https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600	Tin tức	t	2026-03-20 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
065da771-50b7-4eaf-99e1-4ce4b9c6f2a8	Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công	Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...	Hỗ trợ thanh toán qua thẻ ngân hàng, VNPay, MoMo và chuyển khoản — không cần đến cơ quan thuế.	https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600	Hướng dẫn	t	2026-03-18 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
e321db72-f214-4e5b-a262-3563ceaa466f	Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công	Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...	Hỗ trợ chữ ký số USB Token, SmartSign, và thanh toán qua VNPay, PayOS, QR Code ngân hàng.	https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600	Tin tức	t	2026-03-15 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-04-14 12:13:12.13+07
\.


--
-- TOC entry 5922 (class 0 OID 37307)
-- Dependencies: 230
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, "userId", title, "timeInfo", date, status, priority, "createdAt", "updatedAt") FROM stdin;
c06964aa-c9f8-4e14-b683-46fcd2652093	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Tiếp nhận hồ sơ buổi sáng	08:00	2026-04-14	completed	normal	2026-04-14 12:13:12.136+07	2026-04-14 12:13:12.136+07
2737ecc1-1ddb-457d-affb-a3aa86cba6b4	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt 5 hồ sơ khai sinh đang chờ	09:30	2026-04-14	pending	urgent	2026-04-14 12:13:12.136+07	2026-04-14 12:13:12.136+07
2fef4d8f-0224-4d71-9420-677227af2d2e	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Họp bộ phận một cửa	10:00	2026-04-14	pending	normal	2026-04-14 12:13:12.136+07	2026-04-14 12:13:12.136+07
66e7af6c-6a64-4c49-8690-7befd3bb902e	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Tiếp nhận hồ sơ buổi chiều	13:30	2026-04-14	pending	normal	2026-04-14 12:13:12.136+07	2026-04-14 12:13:12.136+07
2306706e-6976-4a8f-a7d3-ef3697edce8c	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Báo cáo kết quả tuần cho trưởng bộ phận	15:00	2026-04-14	pending	urgent	2026-04-14 12:13:12.136+07	2026-04-14 12:13:12.136+07
\.


--
-- TOC entry 5916 (class 0 OID 37161)
-- Dependencies: 224
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, category, description, agency, "processingTime", "processingDays", level, fee, "requiredDocs", "isActive", "createdAt", "updatedAt", "currentFee") FROM stdin;
e0a41035-c7f1-4f07-a266-d3a1d318a3eb	Đăng ký khai sinh	individual	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 4	Miễn phí	[{"label": "Giấy chứng sinh", "docType": "giay_chung_sinh", "required": true}, {"label": "CMND/CCCD cha hoặc mẹ", "docType": "cccd", "required": true}, {"label": "Giấy đăng ký kết hôn", "docType": "giay_dang_ky_ket_hon", "required": false}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	15000
b1965925-499b-4c48-9d8e-ec74ab9679e9	Đăng ký kết hôn	individual	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "Giấy xác nhận tình trạng hôn nhân", "docType": "xac_nhan_hon_nhan", "required": true}, {"label": "CMND/CCCD hai bên", "docType": "cccd", "required": true}, {"label": "Sổ hộ khẩu", "docType": "ho_khau", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	30000
ad05eecc-aecb-42b4-913b-e2d40de887ab	Đăng ký khai tử	individual	\N	Ủy ban nhân dân cấp xã	2 ngày làm việc	2	Mức độ 4	Miễn phí	[{"label": "Giấy báo tử", "docType": "giay_bao_tu", "required": true}, {"label": "CMND/CCCD người thân", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
9bb9280a-e545-4853-934b-e582b504904b	Đăng ký tạm trú	individual	\N	Công an cấp xã	2 ngày làm việc	2	Mức độ 4	Miễn phí	[{"label": "Mẫu CT01 - Tờ khai thay đổi thông tin cư trú", "docType": "mau_ct01", "required": true}, {"label": "Giấy tờ chứng minh chỗ ở hợp pháp", "docType": "giay_cho_o_hop_phap", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
1fca8e79-3c49-47e9-9421-2db889a53971	Đăng ký tạm vắng	individual	\N	Công an cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "CMND/CCCD", "docType": "cccd", "required": true}, {"label": "Sổ hộ khẩu", "docType": "ho_khau", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
dc6bae36-43b2-4d9e-b217-81dacec10953	Chứng thực chữ ký	individual	\N	Ủy ban nhân dân cấp xã	Trong ngày	1	Mức độ 4	10.000 VNĐ	[{"label": "Giấy tờ cần chứng thực", "docType": "giay_to_chung_thuc", "required": true}, {"label": "CMND/CCCD", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
bb8025ff-c0f3-475a-bc46-9436db0403ff	Chứng thực bản sao	individual		Ủy ban nhân dân cấp xã	Trong ngày	1	Mức độ 4	5.000 VNĐ/trang	[{"label": "Bản gốc cần chứng thực", "docType": "ban_goc", "required": true}, {"label": "CMND/CCCD người yêu cầu", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:14:10.798+07	0
21e8d1aa-acab-4b09-b346-7aa72b64e054	Giấy phép xây dựng nhà ở	individual	\N	Ủy ban nhân dân cấp xã	7 ngày làm việc	7	Mức độ 3	50.000 VNĐ	[{"label": "Đơn xin cấp phép xây dựng", "docType": "don_xin_cap_phep", "required": true}, {"label": "Bản vẽ thiết kế", "docType": "ban_ve_thiet_ke", "required": true}, {"label": "Sổ đỏ / Giấy chứng nhận QSDĐ", "docType": "so_do", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
4fa4c5c1-33e5-407e-9578-fa1898e28c20	Đăng ký hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 3	50.000 VNĐ	[{"label": "Mẫu đăng ký hộ kinh doanh", "docType": "mau_dang_ky_hkd", "required": true}, {"label": "CMND/CCCD chủ hộ", "docType": "cccd", "required": true}, {"label": "Giấy tờ về địa điểm kinh doanh", "docType": "giay_to_dia_diem", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
3a7a0a83-7874-410a-92ee-abab0e1891a1	Thay đổi nội dung hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	2 ngày làm việc	2	Mức độ 3	30.000 VNĐ	[{"label": "Thông báo thay đổi nội dung đăng ký", "docType": "thong_bao_thay_doi", "required": true}, {"label": "CMND/CCCD chủ hộ", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
084ca797-d370-4e03-83f4-9df25efb879c	Tạm ngừng kinh doanh	business	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "Thông báo tạm ngừng kinh doanh", "docType": "thong_bao_tam_ngung", "required": true}, {"label": "Giấy chứng nhận đăng ký hộ kinh doanh", "docType": "giay_cn_hkd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
0beced60-7756-4e78-ae79-7e737dac3e5e	Chấm dứt hoạt động hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "Thông báo chấm dứt hoạt động", "docType": "thong_bao_cham_dut", "required": true}, {"label": "Giấy chứng nhận đăng ký hộ kinh doanh", "docType": "giay_cn_hkd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
39bb15e1-e24e-4d80-a869-f85f009a6138	Giấy phép tổ chức lễ hội	organization	\N	Ủy ban nhân dân cấp xã	5 ngày làm việc	5	Mức độ 3	100.000 VNĐ	[{"label": "Đơn xin cấp phép tổ chức lễ hội", "docType": "don_xin_cap_phep", "required": true}, {"label": "Kịch bản chương trình", "docType": "kich_ban", "required": true}, {"label": "Danh sách ban tổ chức", "docType": "danh_sach_btt", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
3beeff4f-e24d-4f0c-9c57-e74b568f08ec	Giấy phép hoạt động văn hóa cộng đồng	organization	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 3	50.000 VNĐ	[{"label": "Đơn xin cấp phép", "docType": "don_xin_cap_phep", "required": true}, {"label": "Nội dung chương trình hoạt động", "docType": "noi_dung_chuong_trinh", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
3fff7f23-d5f0-4aa3-a602-ff921d88d6b8	Đăng ký hoạt động tôn giáo	organization	\N	Ủy ban nhân dân cấp xã	7 ngày làm việc	7	Mức độ 3	Miễn phí	[{"label": "Đơn đăng ký hoạt động tôn giáo", "docType": "don_dang_ky", "required": true}, {"label": "Danh sách người đại diện", "docType": "danh_sach_dd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
abd60163-3583-4e50-a58e-290981379968	Xác nhận hộ nghèo/hộ cận nghèo	organization	\N	Ủy ban nhân dân cấp xã	5 ngày làm việc	5	Mức độ 3	Miễn phí	[{"label": "Đơn đề nghị xác nhận", "docType": "don_de_nghi", "required": true}, {"label": "Sổ hộ khẩu", "docType": "ho_khau", "required": true}, {"label": "CMND/CCCD", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0
\.


--
-- TOC entry 5915 (class 0 OID 37139)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "fullName", cccd, email, password, role, "isVerified", "verifyToken", dob, phone, gender, pob, hometown, address, "taxCode", "insuranceCode", passport, "driverLicense", nationality, "issueDate", "expiryDate", "issuePlace", "officerCode", department, "workPhone", "position", "createdAt", "updatedAt") FROM stdin;
87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Nguyễn Văn B	C82024001	nguyenvanb@bennghe.gov.vn	$2b$10$dqkMeNFwtuZLc24nO.8Ua.EqOkC0uW4HKA861MkTmezJ4A5HNmU8S	officer	t	\N	\N	0912345678	\N	\N	\N	UBND Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh	\N	\N	\N	\N	\N	\N	\N	\N	C82024001	UBND Phường Bến Nghé	\N	Cán bộ tiếp nhận hồ sơ	2026-04-14 12:13:12.051+07	2026-04-14 12:13:12.051+07
10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nguyễn Huy Hoàng	0638473619	nguyenhuyhoang@gmail.com	$2b$10$KJOTNC400i6K3ZHON2Ab4uOmfZMNqhQ.DRAce1.xS6.S9n2akpwEm	citizen	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-04-14 13:19:38.388+07	2026-04-14 13:21:42.839+07
4197d2bc-3f97-4729-8334-230047d5eaf8	Trần Thị Công Dân	079200012345	citizen@example.com	$2b$10$B/RLOJLSlttDgQTpsaaT1.ZNAKZjz9DSn5sOEXSmMHR5l3wsrJLb2	citizen	t	\N	2000-01-01	0901234567	Nam	Hà Nội	Hà Nội	Số 1 Cầu Giấy, Hà Nội	\N	\N	\N	\N	Việt Nam	2021-05-15	2035-01-01	Cục CS QLHC về TTXH	\N	\N	\N	\N	2026-04-14 12:13:11.961+07	2026-04-19 07:56:42.936+07
2688bdb5-bf12-447d-98da-de41be9af9c2	TRIEU DOAN KY	094205001245	trieukyst5678@gmail.com	$2b$10$kp1cJQxQihpH9ebs.rhs9u1sxRDOrBPDM4sHszX4XogHmaaCl0cr2	citizen	t	\N	2005-10-28	\N	Nam	My Xuyen, Can Tho	Ap Thanh Loi, My Xuyen, Can Tho	So 214/38, Tinh Lo 934, Ap Thanh Loi, My Xuyen, Can Tho	\N	\N	\N	\N	Viet Nam	2020-01-30	2030-10-28	BO CONG AN	\N	\N	\N	\N	2026-04-22 10:06:57.469+07	2026-05-11 08:37:45.798+07
\.


--
-- TOC entry 5618 (class 2606 OID 37306)
-- Name: ai_logs ai_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT ai_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5623 (class 2606 OID 37339)
-- Name: application_histories application_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT application_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 5441 (class 2606 OID 85283)
-- Name: applications applications_applicationCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key" UNIQUE ("applicationCode");


--
-- TOC entry 5443 (class 2606 OID 85297)
-- Name: applications applications_applicationCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key10" UNIQUE ("applicationCode");


--
-- TOC entry 5445 (class 2606 OID 85275)
-- Name: applications applications_applicationCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key11" UNIQUE ("applicationCode");


--
-- TOC entry 5447 (class 2606 OID 85299)
-- Name: applications applications_applicationCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key12" UNIQUE ("applicationCode");


--
-- TOC entry 5449 (class 2606 OID 85273)
-- Name: applications applications_applicationCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key13" UNIQUE ("applicationCode");


--
-- TOC entry 5451 (class 2606 OID 85301)
-- Name: applications applications_applicationCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key14" UNIQUE ("applicationCode");


--
-- TOC entry 5453 (class 2606 OID 85303)
-- Name: applications applications_applicationCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key15" UNIQUE ("applicationCode");


--
-- TOC entry 5455 (class 2606 OID 85305)
-- Name: applications applications_applicationCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key16" UNIQUE ("applicationCode");


--
-- TOC entry 5457 (class 2606 OID 85271)
-- Name: applications applications_applicationCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key17" UNIQUE ("applicationCode");


--
-- TOC entry 5459 (class 2606 OID 85307)
-- Name: applications applications_applicationCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key18" UNIQUE ("applicationCode");


--
-- TOC entry 5461 (class 2606 OID 85269)
-- Name: applications applications_applicationCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key19" UNIQUE ("applicationCode");


--
-- TOC entry 5463 (class 2606 OID 85309)
-- Name: applications applications_applicationCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key20" UNIQUE ("applicationCode");


--
-- TOC entry 5465 (class 2606 OID 85267)
-- Name: applications applications_applicationCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key21" UNIQUE ("applicationCode");


--
-- TOC entry 5467 (class 2606 OID 85311)
-- Name: applications applications_applicationCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key22" UNIQUE ("applicationCode");


--
-- TOC entry 5469 (class 2606 OID 85265)
-- Name: applications applications_applicationCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key23" UNIQUE ("applicationCode");


--
-- TOC entry 5471 (class 2606 OID 85313)
-- Name: applications applications_applicationCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key24" UNIQUE ("applicationCode");


--
-- TOC entry 5473 (class 2606 OID 85263)
-- Name: applications applications_applicationCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key25" UNIQUE ("applicationCode");


--
-- TOC entry 5475 (class 2606 OID 85315)
-- Name: applications applications_applicationCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key26" UNIQUE ("applicationCode");


--
-- TOC entry 5477 (class 2606 OID 85261)
-- Name: applications applications_applicationCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key27" UNIQUE ("applicationCode");


--
-- TOC entry 5479 (class 2606 OID 85317)
-- Name: applications applications_applicationCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key28" UNIQUE ("applicationCode");


--
-- TOC entry 5481 (class 2606 OID 85319)
-- Name: applications applications_applicationCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key29" UNIQUE ("applicationCode");


--
-- TOC entry 5483 (class 2606 OID 85259)
-- Name: applications applications_applicationCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key30" UNIQUE ("applicationCode");


--
-- TOC entry 5485 (class 2606 OID 85321)
-- Name: applications applications_applicationCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key31" UNIQUE ("applicationCode");


--
-- TOC entry 5487 (class 2606 OID 85257)
-- Name: applications applications_applicationCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key32" UNIQUE ("applicationCode");


--
-- TOC entry 5489 (class 2606 OID 85323)
-- Name: applications applications_applicationCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key33" UNIQUE ("applicationCode");


--
-- TOC entry 5491 (class 2606 OID 85255)
-- Name: applications applications_applicationCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key34" UNIQUE ("applicationCode");


--
-- TOC entry 5493 (class 2606 OID 85325)
-- Name: applications applications_applicationCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key35" UNIQUE ("applicationCode");


--
-- TOC entry 5495 (class 2606 OID 85327)
-- Name: applications applications_applicationCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key36" UNIQUE ("applicationCode");


--
-- TOC entry 5497 (class 2606 OID 85253)
-- Name: applications applications_applicationCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key37" UNIQUE ("applicationCode");


--
-- TOC entry 5499 (class 2606 OID 85329)
-- Name: applications applications_applicationCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key38" UNIQUE ("applicationCode");


--
-- TOC entry 5501 (class 2606 OID 85251)
-- Name: applications applications_applicationCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key39" UNIQUE ("applicationCode");


--
-- TOC entry 5503 (class 2606 OID 85331)
-- Name: applications applications_applicationCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key40" UNIQUE ("applicationCode");


--
-- TOC entry 5505 (class 2606 OID 85333)
-- Name: applications applications_applicationCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key41" UNIQUE ("applicationCode");


--
-- TOC entry 5507 (class 2606 OID 85249)
-- Name: applications applications_applicationCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key42" UNIQUE ("applicationCode");


--
-- TOC entry 5509 (class 2606 OID 85335)
-- Name: applications applications_applicationCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key43" UNIQUE ("applicationCode");


--
-- TOC entry 5511 (class 2606 OID 85247)
-- Name: applications applications_applicationCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key44" UNIQUE ("applicationCode");


--
-- TOC entry 5513 (class 2606 OID 85337)
-- Name: applications applications_applicationCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key45" UNIQUE ("applicationCode");


--
-- TOC entry 5515 (class 2606 OID 85245)
-- Name: applications applications_applicationCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key46" UNIQUE ("applicationCode");


--
-- TOC entry 5517 (class 2606 OID 85339)
-- Name: applications applications_applicationCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key47" UNIQUE ("applicationCode");


--
-- TOC entry 5519 (class 2606 OID 85243)
-- Name: applications applications_applicationCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key48" UNIQUE ("applicationCode");


--
-- TOC entry 5521 (class 2606 OID 85341)
-- Name: applications applications_applicationCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key49" UNIQUE ("applicationCode");


--
-- TOC entry 5523 (class 2606 OID 85241)
-- Name: applications applications_applicationCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key50" UNIQUE ("applicationCode");


--
-- TOC entry 5525 (class 2606 OID 85343)
-- Name: applications applications_applicationCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key51" UNIQUE ("applicationCode");


--
-- TOC entry 5527 (class 2606 OID 85239)
-- Name: applications applications_applicationCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key52" UNIQUE ("applicationCode");


--
-- TOC entry 5529 (class 2606 OID 85345)
-- Name: applications applications_applicationCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key53" UNIQUE ("applicationCode");


--
-- TOC entry 5531 (class 2606 OID 85237)
-- Name: applications applications_applicationCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key54" UNIQUE ("applicationCode");


--
-- TOC entry 5533 (class 2606 OID 85347)
-- Name: applications applications_applicationCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key55" UNIQUE ("applicationCode");


--
-- TOC entry 5535 (class 2606 OID 85235)
-- Name: applications applications_applicationCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key56" UNIQUE ("applicationCode");


--
-- TOC entry 5537 (class 2606 OID 85349)
-- Name: applications applications_applicationCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key57" UNIQUE ("applicationCode");


--
-- TOC entry 5539 (class 2606 OID 85233)
-- Name: applications applications_applicationCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key58" UNIQUE ("applicationCode");


--
-- TOC entry 5541 (class 2606 OID 85351)
-- Name: applications applications_applicationCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key59" UNIQUE ("applicationCode");


--
-- TOC entry 5543 (class 2606 OID 85231)
-- Name: applications applications_applicationCode_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key60" UNIQUE ("applicationCode");


--
-- TOC entry 5545 (class 2606 OID 85353)
-- Name: applications applications_applicationCode_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key61" UNIQUE ("applicationCode");


--
-- TOC entry 5547 (class 2606 OID 85229)
-- Name: applications applications_applicationCode_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key62" UNIQUE ("applicationCode");


--
-- TOC entry 5549 (class 2606 OID 85355)
-- Name: applications applications_applicationCode_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key63" UNIQUE ("applicationCode");


--
-- TOC entry 5551 (class 2606 OID 85357)
-- Name: applications applications_applicationCode_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key64" UNIQUE ("applicationCode");


--
-- TOC entry 5553 (class 2606 OID 85227)
-- Name: applications applications_applicationCode_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key65" UNIQUE ("applicationCode");


--
-- TOC entry 5555 (class 2606 OID 85359)
-- Name: applications applications_applicationCode_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key66" UNIQUE ("applicationCode");


--
-- TOC entry 5557 (class 2606 OID 85225)
-- Name: applications applications_applicationCode_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key67" UNIQUE ("applicationCode");


--
-- TOC entry 5559 (class 2606 OID 85361)
-- Name: applications applications_applicationCode_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key68" UNIQUE ("applicationCode");


--
-- TOC entry 5561 (class 2606 OID 85363)
-- Name: applications applications_applicationCode_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key69" UNIQUE ("applicationCode");


--
-- TOC entry 5563 (class 2606 OID 85365)
-- Name: applications applications_applicationCode_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key70" UNIQUE ("applicationCode");


--
-- TOC entry 5565 (class 2606 OID 85223)
-- Name: applications applications_applicationCode_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key71" UNIQUE ("applicationCode");


--
-- TOC entry 5567 (class 2606 OID 85367)
-- Name: applications applications_applicationCode_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key72" UNIQUE ("applicationCode");


--
-- TOC entry 5569 (class 2606 OID 85369)
-- Name: applications applications_applicationCode_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key73" UNIQUE ("applicationCode");


--
-- TOC entry 5571 (class 2606 OID 85371)
-- Name: applications applications_applicationCode_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key74" UNIQUE ("applicationCode");


--
-- TOC entry 5573 (class 2606 OID 85221)
-- Name: applications applications_applicationCode_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key75" UNIQUE ("applicationCode");


--
-- TOC entry 5575 (class 2606 OID 85373)
-- Name: applications applications_applicationCode_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key76" UNIQUE ("applicationCode");


--
-- TOC entry 5577 (class 2606 OID 85219)
-- Name: applications applications_applicationCode_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key77" UNIQUE ("applicationCode");


--
-- TOC entry 5579 (class 2606 OID 85375)
-- Name: applications applications_applicationCode_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key78" UNIQUE ("applicationCode");


--
-- TOC entry 5581 (class 2606 OID 85217)
-- Name: applications applications_applicationCode_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key79" UNIQUE ("applicationCode");


--
-- TOC entry 5583 (class 2606 OID 85295)
-- Name: applications applications_applicationCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key8" UNIQUE ("applicationCode");


--
-- TOC entry 5585 (class 2606 OID 85377)
-- Name: applications applications_applicationCode_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key80" UNIQUE ("applicationCode");


--
-- TOC entry 5587 (class 2606 OID 85379)
-- Name: applications applications_applicationCode_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key81" UNIQUE ("applicationCode");


--
-- TOC entry 5589 (class 2606 OID 85215)
-- Name: applications applications_applicationCode_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key82" UNIQUE ("applicationCode");


--
-- TOC entry 5591 (class 2606 OID 85381)
-- Name: applications applications_applicationCode_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key83" UNIQUE ("applicationCode");


--
-- TOC entry 5593 (class 2606 OID 85383)
-- Name: applications applications_applicationCode_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key84" UNIQUE ("applicationCode");


--
-- TOC entry 5595 (class 2606 OID 85213)
-- Name: applications applications_applicationCode_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key85" UNIQUE ("applicationCode");


--
-- TOC entry 5597 (class 2606 OID 85385)
-- Name: applications applications_applicationCode_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key86" UNIQUE ("applicationCode");


--
-- TOC entry 5599 (class 2606 OID 85277)
-- Name: applications applications_applicationCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key9" UNIQUE ("applicationCode");


--
-- TOC entry 5601 (class 2606 OID 37208)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 16713)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5615 (class 2606 OID 37286)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 5608 (class 2606 OID 37239)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5613 (class 2606 OID 37256)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5631 (class 2606 OID 44479)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5633 (class 2606 OID 85534)
-- Name: payments payments_receiptCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key" UNIQUE ("receiptCode");


--
-- TOC entry 5635 (class 2606 OID 85536)
-- Name: payments payments_receiptCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key1" UNIQUE ("receiptCode");


--
-- TOC entry 5637 (class 2606 OID 85546)
-- Name: payments payments_receiptCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key10" UNIQUE ("receiptCode");


--
-- TOC entry 5639 (class 2606 OID 85548)
-- Name: payments payments_receiptCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key11" UNIQUE ("receiptCode");


--
-- TOC entry 5641 (class 2606 OID 85580)
-- Name: payments payments_receiptCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key12" UNIQUE ("receiptCode");


--
-- TOC entry 5643 (class 2606 OID 85550)
-- Name: payments payments_receiptCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key13" UNIQUE ("receiptCode");


--
-- TOC entry 5645 (class 2606 OID 85552)
-- Name: payments payments_receiptCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key14" UNIQUE ("receiptCode");


--
-- TOC entry 5647 (class 2606 OID 85578)
-- Name: payments payments_receiptCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key15" UNIQUE ("receiptCode");


--
-- TOC entry 5649 (class 2606 OID 85554)
-- Name: payments payments_receiptCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key16" UNIQUE ("receiptCode");


--
-- TOC entry 5651 (class 2606 OID 85576)
-- Name: payments payments_receiptCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key17" UNIQUE ("receiptCode");


--
-- TOC entry 5653 (class 2606 OID 85556)
-- Name: payments payments_receiptCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key18" UNIQUE ("receiptCode");


--
-- TOC entry 5655 (class 2606 OID 85574)
-- Name: payments payments_receiptCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key19" UNIQUE ("receiptCode");


--
-- TOC entry 5657 (class 2606 OID 85538)
-- Name: payments payments_receiptCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key2" UNIQUE ("receiptCode");


--
-- TOC entry 5659 (class 2606 OID 85558)
-- Name: payments payments_receiptCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key20" UNIQUE ("receiptCode");


--
-- TOC entry 5661 (class 2606 OID 85572)
-- Name: payments payments_receiptCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key21" UNIQUE ("receiptCode");


--
-- TOC entry 5663 (class 2606 OID 85560)
-- Name: payments payments_receiptCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key22" UNIQUE ("receiptCode");


--
-- TOC entry 5665 (class 2606 OID 85570)
-- Name: payments payments_receiptCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key23" UNIQUE ("receiptCode");


--
-- TOC entry 5667 (class 2606 OID 85562)
-- Name: payments payments_receiptCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key24" UNIQUE ("receiptCode");


--
-- TOC entry 5669 (class 2606 OID 85568)
-- Name: payments payments_receiptCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key25" UNIQUE ("receiptCode");


--
-- TOC entry 5671 (class 2606 OID 85564)
-- Name: payments payments_receiptCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key26" UNIQUE ("receiptCode");


--
-- TOC entry 5673 (class 2606 OID 85566)
-- Name: payments payments_receiptCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key27" UNIQUE ("receiptCode");


--
-- TOC entry 5675 (class 2606 OID 85528)
-- Name: payments payments_receiptCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key28" UNIQUE ("receiptCode");


--
-- TOC entry 5677 (class 2606 OID 85526)
-- Name: payments payments_receiptCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key29" UNIQUE ("receiptCode");


--
-- TOC entry 5679 (class 2606 OID 85532)
-- Name: payments payments_receiptCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key3" UNIQUE ("receiptCode");


--
-- TOC entry 5681 (class 2606 OID 85586)
-- Name: payments payments_receiptCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key30" UNIQUE ("receiptCode");


--
-- TOC entry 5683 (class 2606 OID 85524)
-- Name: payments payments_receiptCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key31" UNIQUE ("receiptCode");


--
-- TOC entry 5685 (class 2606 OID 85588)
-- Name: payments payments_receiptCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key32" UNIQUE ("receiptCode");


--
-- TOC entry 5687 (class 2606 OID 85522)
-- Name: payments payments_receiptCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key33" UNIQUE ("receiptCode");


--
-- TOC entry 5689 (class 2606 OID 85590)
-- Name: payments payments_receiptCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key34" UNIQUE ("receiptCode");


--
-- TOC entry 5691 (class 2606 OID 85520)
-- Name: payments payments_receiptCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key35" UNIQUE ("receiptCode");


--
-- TOC entry 5693 (class 2606 OID 85592)
-- Name: payments payments_receiptCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key36" UNIQUE ("receiptCode");


--
-- TOC entry 5695 (class 2606 OID 85594)
-- Name: payments payments_receiptCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key37" UNIQUE ("receiptCode");


--
-- TOC entry 5697 (class 2606 OID 85518)
-- Name: payments payments_receiptCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key38" UNIQUE ("receiptCode");


--
-- TOC entry 5699 (class 2606 OID 85596)
-- Name: payments payments_receiptCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key39" UNIQUE ("receiptCode");


--
-- TOC entry 5701 (class 2606 OID 85540)
-- Name: payments payments_receiptCode_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key4" UNIQUE ("receiptCode");


--
-- TOC entry 5703 (class 2606 OID 85516)
-- Name: payments payments_receiptCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key40" UNIQUE ("receiptCode");


--
-- TOC entry 5705 (class 2606 OID 85598)
-- Name: payments payments_receiptCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key41" UNIQUE ("receiptCode");


--
-- TOC entry 5707 (class 2606 OID 85600)
-- Name: payments payments_receiptCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key42" UNIQUE ("receiptCode");


--
-- TOC entry 5709 (class 2606 OID 85602)
-- Name: payments payments_receiptCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key43" UNIQUE ("receiptCode");


--
-- TOC entry 5711 (class 2606 OID 85514)
-- Name: payments payments_receiptCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key44" UNIQUE ("receiptCode");


--
-- TOC entry 5713 (class 2606 OID 85604)
-- Name: payments payments_receiptCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key45" UNIQUE ("receiptCode");


--
-- TOC entry 5715 (class 2606 OID 85606)
-- Name: payments payments_receiptCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key46" UNIQUE ("receiptCode");


--
-- TOC entry 5717 (class 2606 OID 85608)
-- Name: payments payments_receiptCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key47" UNIQUE ("receiptCode");


--
-- TOC entry 5719 (class 2606 OID 85512)
-- Name: payments payments_receiptCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key48" UNIQUE ("receiptCode");


--
-- TOC entry 5721 (class 2606 OID 85610)
-- Name: payments payments_receiptCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key49" UNIQUE ("receiptCode");


--
-- TOC entry 5723 (class 2606 OID 85530)
-- Name: payments payments_receiptCode_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key5" UNIQUE ("receiptCode");


--
-- TOC entry 5725 (class 2606 OID 85510)
-- Name: payments payments_receiptCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key50" UNIQUE ("receiptCode");


--
-- TOC entry 5727 (class 2606 OID 85612)
-- Name: payments payments_receiptCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key51" UNIQUE ("receiptCode");


--
-- TOC entry 5729 (class 2606 OID 85508)
-- Name: payments payments_receiptCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key52" UNIQUE ("receiptCode");


--
-- TOC entry 5731 (class 2606 OID 85614)
-- Name: payments payments_receiptCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key53" UNIQUE ("receiptCode");


--
-- TOC entry 5733 (class 2606 OID 85616)
-- Name: payments payments_receiptCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key54" UNIQUE ("receiptCode");


--
-- TOC entry 5735 (class 2606 OID 85506)
-- Name: payments payments_receiptCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key55" UNIQUE ("receiptCode");


--
-- TOC entry 5737 (class 2606 OID 85618)
-- Name: payments payments_receiptCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key56" UNIQUE ("receiptCode");


--
-- TOC entry 5739 (class 2606 OID 85620)
-- Name: payments payments_receiptCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key57" UNIQUE ("receiptCode");


--
-- TOC entry 5741 (class 2606 OID 85504)
-- Name: payments payments_receiptCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key58" UNIQUE ("receiptCode");


--
-- TOC entry 5743 (class 2606 OID 85622)
-- Name: payments payments_receiptCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key59" UNIQUE ("receiptCode");


--
-- TOC entry 5745 (class 2606 OID 85542)
-- Name: payments payments_receiptCode_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key6" UNIQUE ("receiptCode");


--
-- TOC entry 5747 (class 2606 OID 85584)
-- Name: payments payments_receiptCode_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key7" UNIQUE ("receiptCode");


--
-- TOC entry 5749 (class 2606 OID 85544)
-- Name: payments payments_receiptCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key8" UNIQUE ("receiptCode");


--
-- TOC entry 5751 (class 2606 OID 85582)
-- Name: payments payments_receiptCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key9" UNIQUE ("receiptCode");


--
-- TOC entry 5627 (class 2606 OID 37369)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 5621 (class 2606 OID 37322)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5439 (class 2606 OID 37179)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4957 (class 2606 OID 84774)
-- Name: users users_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key UNIQUE (cccd);


--
-- TOC entry 4959 (class 2606 OID 84788)
-- Name: users users_cccd_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key10 UNIQUE (cccd);


--
-- TOC entry 4961 (class 2606 OID 84766)
-- Name: users users_cccd_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key11 UNIQUE (cccd);


--
-- TOC entry 4963 (class 2606 OID 84790)
-- Name: users users_cccd_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key12 UNIQUE (cccd);


--
-- TOC entry 4965 (class 2606 OID 84764)
-- Name: users users_cccd_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key13 UNIQUE (cccd);


--
-- TOC entry 4967 (class 2606 OID 84792)
-- Name: users users_cccd_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key14 UNIQUE (cccd);


--
-- TOC entry 4969 (class 2606 OID 84794)
-- Name: users users_cccd_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key15 UNIQUE (cccd);


--
-- TOC entry 4971 (class 2606 OID 84796)
-- Name: users users_cccd_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key16 UNIQUE (cccd);


--
-- TOC entry 4973 (class 2606 OID 84762)
-- Name: users users_cccd_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key17 UNIQUE (cccd);


--
-- TOC entry 4975 (class 2606 OID 84798)
-- Name: users users_cccd_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key18 UNIQUE (cccd);


--
-- TOC entry 4977 (class 2606 OID 84760)
-- Name: users users_cccd_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key19 UNIQUE (cccd);


--
-- TOC entry 4979 (class 2606 OID 84800)
-- Name: users users_cccd_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key20 UNIQUE (cccd);


--
-- TOC entry 4981 (class 2606 OID 84758)
-- Name: users users_cccd_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key21 UNIQUE (cccd);


--
-- TOC entry 4983 (class 2606 OID 84802)
-- Name: users users_cccd_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key22 UNIQUE (cccd);


--
-- TOC entry 4985 (class 2606 OID 84756)
-- Name: users users_cccd_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key23 UNIQUE (cccd);


--
-- TOC entry 4987 (class 2606 OID 84804)
-- Name: users users_cccd_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key24 UNIQUE (cccd);


--
-- TOC entry 4989 (class 2606 OID 84754)
-- Name: users users_cccd_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key25 UNIQUE (cccd);


--
-- TOC entry 4991 (class 2606 OID 84806)
-- Name: users users_cccd_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key26 UNIQUE (cccd);


--
-- TOC entry 4993 (class 2606 OID 84752)
-- Name: users users_cccd_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key27 UNIQUE (cccd);


--
-- TOC entry 4995 (class 2606 OID 84808)
-- Name: users users_cccd_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key28 UNIQUE (cccd);


--
-- TOC entry 4997 (class 2606 OID 84674)
-- Name: users users_cccd_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key29 UNIQUE (cccd);


--
-- TOC entry 4999 (class 2606 OID 84750)
-- Name: users users_cccd_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key30 UNIQUE (cccd);


--
-- TOC entry 5001 (class 2606 OID 84676)
-- Name: users users_cccd_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key31 UNIQUE (cccd);


--
-- TOC entry 5003 (class 2606 OID 84748)
-- Name: users users_cccd_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key32 UNIQUE (cccd);


--
-- TOC entry 5005 (class 2606 OID 84678)
-- Name: users users_cccd_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key33 UNIQUE (cccd);


--
-- TOC entry 5007 (class 2606 OID 84746)
-- Name: users users_cccd_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key34 UNIQUE (cccd);


--
-- TOC entry 5009 (class 2606 OID 84810)
-- Name: users users_cccd_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key35 UNIQUE (cccd);


--
-- TOC entry 5011 (class 2606 OID 84812)
-- Name: users users_cccd_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key36 UNIQUE (cccd);


--
-- TOC entry 5013 (class 2606 OID 84744)
-- Name: users users_cccd_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key37 UNIQUE (cccd);


--
-- TOC entry 5015 (class 2606 OID 84814)
-- Name: users users_cccd_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key38 UNIQUE (cccd);


--
-- TOC entry 5017 (class 2606 OID 84742)
-- Name: users users_cccd_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key39 UNIQUE (cccd);


--
-- TOC entry 5019 (class 2606 OID 84740)
-- Name: users users_cccd_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key40 UNIQUE (cccd);


--
-- TOC entry 5021 (class 2606 OID 84816)
-- Name: users users_cccd_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key41 UNIQUE (cccd);


--
-- TOC entry 5023 (class 2606 OID 84738)
-- Name: users users_cccd_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key42 UNIQUE (cccd);


--
-- TOC entry 5025 (class 2606 OID 84684)
-- Name: users users_cccd_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key43 UNIQUE (cccd);


--
-- TOC entry 5027 (class 2606 OID 84736)
-- Name: users users_cccd_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key44 UNIQUE (cccd);


--
-- TOC entry 5029 (class 2606 OID 84686)
-- Name: users users_cccd_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key45 UNIQUE (cccd);


--
-- TOC entry 5031 (class 2606 OID 84734)
-- Name: users users_cccd_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key46 UNIQUE (cccd);


--
-- TOC entry 5033 (class 2606 OID 84732)
-- Name: users users_cccd_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key47 UNIQUE (cccd);


--
-- TOC entry 5035 (class 2606 OID 84730)
-- Name: users users_cccd_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key48 UNIQUE (cccd);


--
-- TOC entry 5037 (class 2606 OID 84728)
-- Name: users users_cccd_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key49 UNIQUE (cccd);


--
-- TOC entry 5039 (class 2606 OID 84726)
-- Name: users users_cccd_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key50 UNIQUE (cccd);


--
-- TOC entry 5041 (class 2606 OID 84724)
-- Name: users users_cccd_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key51 UNIQUE (cccd);


--
-- TOC entry 5043 (class 2606 OID 84722)
-- Name: users users_cccd_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key52 UNIQUE (cccd);


--
-- TOC entry 5045 (class 2606 OID 84720)
-- Name: users users_cccd_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key53 UNIQUE (cccd);


--
-- TOC entry 5047 (class 2606 OID 84718)
-- Name: users users_cccd_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key54 UNIQUE (cccd);


--
-- TOC entry 5049 (class 2606 OID 84688)
-- Name: users users_cccd_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key55 UNIQUE (cccd);


--
-- TOC entry 5051 (class 2606 OID 84716)
-- Name: users users_cccd_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key56 UNIQUE (cccd);


--
-- TOC entry 5053 (class 2606 OID 84714)
-- Name: users users_cccd_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key57 UNIQUE (cccd);


--
-- TOC entry 5055 (class 2606 OID 84712)
-- Name: users users_cccd_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key58 UNIQUE (cccd);


--
-- TOC entry 5057 (class 2606 OID 84710)
-- Name: users users_cccd_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key59 UNIQUE (cccd);


--
-- TOC entry 5059 (class 2606 OID 84708)
-- Name: users users_cccd_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key60 UNIQUE (cccd);


--
-- TOC entry 5061 (class 2606 OID 84706)
-- Name: users users_cccd_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key61 UNIQUE (cccd);


--
-- TOC entry 5063 (class 2606 OID 84704)
-- Name: users users_cccd_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key62 UNIQUE (cccd);


--
-- TOC entry 5065 (class 2606 OID 84702)
-- Name: users users_cccd_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key63 UNIQUE (cccd);


--
-- TOC entry 5067 (class 2606 OID 84690)
-- Name: users users_cccd_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key64 UNIQUE (cccd);


--
-- TOC entry 5069 (class 2606 OID 84700)
-- Name: users users_cccd_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key65 UNIQUE (cccd);


--
-- TOC entry 5071 (class 2606 OID 84698)
-- Name: users users_cccd_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key66 UNIQUE (cccd);


--
-- TOC entry 5073 (class 2606 OID 84696)
-- Name: users users_cccd_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key67 UNIQUE (cccd);


--
-- TOC entry 5075 (class 2606 OID 84694)
-- Name: users users_cccd_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key68 UNIQUE (cccd);


--
-- TOC entry 5077 (class 2606 OID 84692)
-- Name: users users_cccd_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key69 UNIQUE (cccd);


--
-- TOC entry 5079 (class 2606 OID 84818)
-- Name: users users_cccd_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key70 UNIQUE (cccd);


--
-- TOC entry 5081 (class 2606 OID 84682)
-- Name: users users_cccd_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key71 UNIQUE (cccd);


--
-- TOC entry 5083 (class 2606 OID 84680)
-- Name: users users_cccd_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key72 UNIQUE (cccd);


--
-- TOC entry 5085 (class 2606 OID 84820)
-- Name: users users_cccd_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key73 UNIQUE (cccd);


--
-- TOC entry 5087 (class 2606 OID 84822)
-- Name: users users_cccd_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key74 UNIQUE (cccd);


--
-- TOC entry 5089 (class 2606 OID 84672)
-- Name: users users_cccd_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key75 UNIQUE (cccd);


--
-- TOC entry 5091 (class 2606 OID 84670)
-- Name: users users_cccd_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key76 UNIQUE (cccd);


--
-- TOC entry 5093 (class 2606 OID 84668)
-- Name: users users_cccd_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key77 UNIQUE (cccd);


--
-- TOC entry 5095 (class 2606 OID 84666)
-- Name: users users_cccd_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key78 UNIQUE (cccd);


--
-- TOC entry 5097 (class 2606 OID 84664)
-- Name: users users_cccd_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key79 UNIQUE (cccd);


--
-- TOC entry 5099 (class 2606 OID 84786)
-- Name: users users_cccd_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key8 UNIQUE (cccd);


--
-- TOC entry 5101 (class 2606 OID 84662)
-- Name: users users_cccd_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key80 UNIQUE (cccd);


--
-- TOC entry 5103 (class 2606 OID 84824)
-- Name: users users_cccd_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key81 UNIQUE (cccd);


--
-- TOC entry 5105 (class 2606 OID 84660)
-- Name: users users_cccd_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key82 UNIQUE (cccd);


--
-- TOC entry 5107 (class 2606 OID 84658)
-- Name: users users_cccd_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key83 UNIQUE (cccd);


--
-- TOC entry 5109 (class 2606 OID 84826)
-- Name: users users_cccd_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key84 UNIQUE (cccd);


--
-- TOC entry 5111 (class 2606 OID 84656)
-- Name: users users_cccd_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key85 UNIQUE (cccd);


--
-- TOC entry 5113 (class 2606 OID 84828)
-- Name: users users_cccd_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key86 UNIQUE (cccd);


--
-- TOC entry 5115 (class 2606 OID 84768)
-- Name: users users_cccd_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key9 UNIQUE (cccd);


--
-- TOC entry 5117 (class 2606 OID 84903)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5119 (class 2606 OID 84917)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 5121 (class 2606 OID 84895)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 5123 (class 2606 OID 84919)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 5125 (class 2606 OID 84893)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 5127 (class 2606 OID 84921)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 5129 (class 2606 OID 84923)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 5131 (class 2606 OID 84925)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 5133 (class 2606 OID 84891)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 5135 (class 2606 OID 84927)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 5137 (class 2606 OID 84889)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 5139 (class 2606 OID 84929)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 5141 (class 2606 OID 84887)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 5143 (class 2606 OID 84931)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 5145 (class 2606 OID 84885)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 5147 (class 2606 OID 84933)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 5149 (class 2606 OID 84883)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 5151 (class 2606 OID 84935)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 5153 (class 2606 OID 84881)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 5155 (class 2606 OID 84937)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 5157 (class 2606 OID 84939)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 5159 (class 2606 OID 84879)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 5161 (class 2606 OID 84941)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 5163 (class 2606 OID 84877)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 5165 (class 2606 OID 84943)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 5167 (class 2606 OID 84875)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 5169 (class 2606 OID 84945)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 5171 (class 2606 OID 84947)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 5173 (class 2606 OID 84873)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 5175 (class 2606 OID 84949)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 5177 (class 2606 OID 84871)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 5179 (class 2606 OID 84951)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 5181 (class 2606 OID 84953)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 5183 (class 2606 OID 84869)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 5185 (class 2606 OID 84955)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 5187 (class 2606 OID 84867)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 5189 (class 2606 OID 84957)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 5191 (class 2606 OID 84865)
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- TOC entry 5193 (class 2606 OID 84959)
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- TOC entry 5195 (class 2606 OID 84863)
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- TOC entry 5197 (class 2606 OID 84961)
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- TOC entry 5199 (class 2606 OID 84861)
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- TOC entry 5201 (class 2606 OID 84963)
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- TOC entry 5203 (class 2606 OID 84859)
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- TOC entry 5205 (class 2606 OID 84965)
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- TOC entry 5207 (class 2606 OID 84857)
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- TOC entry 5209 (class 2606 OID 84967)
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- TOC entry 5211 (class 2606 OID 84855)
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- TOC entry 5213 (class 2606 OID 84969)
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- TOC entry 5215 (class 2606 OID 84853)
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- TOC entry 5217 (class 2606 OID 84971)
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- TOC entry 5219 (class 2606 OID 84851)
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- TOC entry 5221 (class 2606 OID 84973)
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- TOC entry 5223 (class 2606 OID 84849)
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- TOC entry 5225 (class 2606 OID 84975)
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- TOC entry 5227 (class 2606 OID 84977)
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- TOC entry 5229 (class 2606 OID 84847)
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- TOC entry 5231 (class 2606 OID 84979)
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- TOC entry 5233 (class 2606 OID 84845)
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- TOC entry 5235 (class 2606 OID 84981)
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- TOC entry 5237 (class 2606 OID 84983)
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- TOC entry 5239 (class 2606 OID 84985)
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- TOC entry 5241 (class 2606 OID 84843)
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- TOC entry 5243 (class 2606 OID 84987)
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- TOC entry 5245 (class 2606 OID 84989)
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- TOC entry 5247 (class 2606 OID 84991)
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- TOC entry 5249 (class 2606 OID 84841)
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- TOC entry 5251 (class 2606 OID 84993)
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- TOC entry 5253 (class 2606 OID 84839)
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- TOC entry 5255 (class 2606 OID 84995)
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- TOC entry 5257 (class 2606 OID 84837)
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- TOC entry 5259 (class 2606 OID 84915)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 5261 (class 2606 OID 84997)
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- TOC entry 5263 (class 2606 OID 84999)
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- TOC entry 5265 (class 2606 OID 84835)
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- TOC entry 5267 (class 2606 OID 85001)
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- TOC entry 5269 (class 2606 OID 85003)
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- TOC entry 5271 (class 2606 OID 84833)
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- TOC entry 5273 (class 2606 OID 85005)
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- TOC entry 5275 (class 2606 OID 84897)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 5277 (class 2606 OID 85085)
-- Name: users users_officerCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key" UNIQUE ("officerCode");


--
-- TOC entry 5279 (class 2606 OID 85099)
-- Name: users users_officerCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key10" UNIQUE ("officerCode");


--
-- TOC entry 5281 (class 2606 OID 85077)
-- Name: users users_officerCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key11" UNIQUE ("officerCode");


--
-- TOC entry 5283 (class 2606 OID 85101)
-- Name: users users_officerCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key12" UNIQUE ("officerCode");


--
-- TOC entry 5285 (class 2606 OID 85075)
-- Name: users users_officerCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key13" UNIQUE ("officerCode");


--
-- TOC entry 5287 (class 2606 OID 85103)
-- Name: users users_officerCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key14" UNIQUE ("officerCode");


--
-- TOC entry 5289 (class 2606 OID 85105)
-- Name: users users_officerCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key15" UNIQUE ("officerCode");


--
-- TOC entry 5291 (class 2606 OID 85107)
-- Name: users users_officerCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key16" UNIQUE ("officerCode");


--
-- TOC entry 5293 (class 2606 OID 85073)
-- Name: users users_officerCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key17" UNIQUE ("officerCode");


--
-- TOC entry 5295 (class 2606 OID 85109)
-- Name: users users_officerCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key18" UNIQUE ("officerCode");


--
-- TOC entry 5297 (class 2606 OID 85071)
-- Name: users users_officerCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key19" UNIQUE ("officerCode");


--
-- TOC entry 5299 (class 2606 OID 85111)
-- Name: users users_officerCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key20" UNIQUE ("officerCode");


--
-- TOC entry 5301 (class 2606 OID 85069)
-- Name: users users_officerCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key21" UNIQUE ("officerCode");


--
-- TOC entry 5303 (class 2606 OID 85113)
-- Name: users users_officerCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key22" UNIQUE ("officerCode");


--
-- TOC entry 5305 (class 2606 OID 85067)
-- Name: users users_officerCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key23" UNIQUE ("officerCode");


--
-- TOC entry 5307 (class 2606 OID 85115)
-- Name: users users_officerCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key24" UNIQUE ("officerCode");


--
-- TOC entry 5309 (class 2606 OID 85065)
-- Name: users users_officerCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key25" UNIQUE ("officerCode");


--
-- TOC entry 5311 (class 2606 OID 85117)
-- Name: users users_officerCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key26" UNIQUE ("officerCode");


--
-- TOC entry 5313 (class 2606 OID 85063)
-- Name: users users_officerCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key27" UNIQUE ("officerCode");


--
-- TOC entry 5315 (class 2606 OID 85119)
-- Name: users users_officerCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key28" UNIQUE ("officerCode");


--
-- TOC entry 5317 (class 2606 OID 85121)
-- Name: users users_officerCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key29" UNIQUE ("officerCode");


--
-- TOC entry 5319 (class 2606 OID 85061)
-- Name: users users_officerCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key30" UNIQUE ("officerCode");


--
-- TOC entry 5321 (class 2606 OID 85123)
-- Name: users users_officerCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key31" UNIQUE ("officerCode");


--
-- TOC entry 5323 (class 2606 OID 85059)
-- Name: users users_officerCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key32" UNIQUE ("officerCode");


--
-- TOC entry 5325 (class 2606 OID 85125)
-- Name: users users_officerCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key33" UNIQUE ("officerCode");


--
-- TOC entry 5327 (class 2606 OID 85057)
-- Name: users users_officerCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key34" UNIQUE ("officerCode");


--
-- TOC entry 5329 (class 2606 OID 85127)
-- Name: users users_officerCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key35" UNIQUE ("officerCode");


--
-- TOC entry 5331 (class 2606 OID 85129)
-- Name: users users_officerCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key36" UNIQUE ("officerCode");


--
-- TOC entry 5333 (class 2606 OID 85055)
-- Name: users users_officerCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key37" UNIQUE ("officerCode");


--
-- TOC entry 5335 (class 2606 OID 85131)
-- Name: users users_officerCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key38" UNIQUE ("officerCode");


--
-- TOC entry 5337 (class 2606 OID 85053)
-- Name: users users_officerCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key39" UNIQUE ("officerCode");


--
-- TOC entry 5339 (class 2606 OID 85133)
-- Name: users users_officerCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key40" UNIQUE ("officerCode");


--
-- TOC entry 5341 (class 2606 OID 85135)
-- Name: users users_officerCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key41" UNIQUE ("officerCode");


--
-- TOC entry 5343 (class 2606 OID 85051)
-- Name: users users_officerCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key42" UNIQUE ("officerCode");


--
-- TOC entry 5345 (class 2606 OID 85137)
-- Name: users users_officerCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key43" UNIQUE ("officerCode");


--
-- TOC entry 5347 (class 2606 OID 85049)
-- Name: users users_officerCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key44" UNIQUE ("officerCode");


--
-- TOC entry 5349 (class 2606 OID 85139)
-- Name: users users_officerCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key45" UNIQUE ("officerCode");


--
-- TOC entry 5351 (class 2606 OID 85047)
-- Name: users users_officerCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key46" UNIQUE ("officerCode");


--
-- TOC entry 5353 (class 2606 OID 85141)
-- Name: users users_officerCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key47" UNIQUE ("officerCode");


--
-- TOC entry 5355 (class 2606 OID 85045)
-- Name: users users_officerCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key48" UNIQUE ("officerCode");


--
-- TOC entry 5357 (class 2606 OID 85143)
-- Name: users users_officerCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key49" UNIQUE ("officerCode");


--
-- TOC entry 5359 (class 2606 OID 85043)
-- Name: users users_officerCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key50" UNIQUE ("officerCode");


--
-- TOC entry 5361 (class 2606 OID 85145)
-- Name: users users_officerCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key51" UNIQUE ("officerCode");


--
-- TOC entry 5363 (class 2606 OID 85041)
-- Name: users users_officerCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key52" UNIQUE ("officerCode");


--
-- TOC entry 5365 (class 2606 OID 85147)
-- Name: users users_officerCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key53" UNIQUE ("officerCode");


--
-- TOC entry 5367 (class 2606 OID 85039)
-- Name: users users_officerCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key54" UNIQUE ("officerCode");


--
-- TOC entry 5369 (class 2606 OID 85149)
-- Name: users users_officerCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key55" UNIQUE ("officerCode");


--
-- TOC entry 5371 (class 2606 OID 85037)
-- Name: users users_officerCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key56" UNIQUE ("officerCode");


--
-- TOC entry 5373 (class 2606 OID 85151)
-- Name: users users_officerCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key57" UNIQUE ("officerCode");


--
-- TOC entry 5375 (class 2606 OID 85035)
-- Name: users users_officerCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key58" UNIQUE ("officerCode");


--
-- TOC entry 5377 (class 2606 OID 85153)
-- Name: users users_officerCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key59" UNIQUE ("officerCode");


--
-- TOC entry 5379 (class 2606 OID 85033)
-- Name: users users_officerCode_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key60" UNIQUE ("officerCode");


--
-- TOC entry 5381 (class 2606 OID 85155)
-- Name: users users_officerCode_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key61" UNIQUE ("officerCode");


--
-- TOC entry 5383 (class 2606 OID 85031)
-- Name: users users_officerCode_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key62" UNIQUE ("officerCode");


--
-- TOC entry 5385 (class 2606 OID 85157)
-- Name: users users_officerCode_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key63" UNIQUE ("officerCode");


--
-- TOC entry 5387 (class 2606 OID 85159)
-- Name: users users_officerCode_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key64" UNIQUE ("officerCode");


--
-- TOC entry 5389 (class 2606 OID 85029)
-- Name: users users_officerCode_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key65" UNIQUE ("officerCode");


--
-- TOC entry 5391 (class 2606 OID 85161)
-- Name: users users_officerCode_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key66" UNIQUE ("officerCode");


--
-- TOC entry 5393 (class 2606 OID 85027)
-- Name: users users_officerCode_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key67" UNIQUE ("officerCode");


--
-- TOC entry 5395 (class 2606 OID 85163)
-- Name: users users_officerCode_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key68" UNIQUE ("officerCode");


--
-- TOC entry 5397 (class 2606 OID 85165)
-- Name: users users_officerCode_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key69" UNIQUE ("officerCode");


--
-- TOC entry 5399 (class 2606 OID 85167)
-- Name: users users_officerCode_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key70" UNIQUE ("officerCode");


--
-- TOC entry 5401 (class 2606 OID 85025)
-- Name: users users_officerCode_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key71" UNIQUE ("officerCode");


--
-- TOC entry 5403 (class 2606 OID 85169)
-- Name: users users_officerCode_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key72" UNIQUE ("officerCode");


--
-- TOC entry 5405 (class 2606 OID 85171)
-- Name: users users_officerCode_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key73" UNIQUE ("officerCode");


--
-- TOC entry 5407 (class 2606 OID 85173)
-- Name: users users_officerCode_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key74" UNIQUE ("officerCode");


--
-- TOC entry 5409 (class 2606 OID 85023)
-- Name: users users_officerCode_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key75" UNIQUE ("officerCode");


--
-- TOC entry 5411 (class 2606 OID 85175)
-- Name: users users_officerCode_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key76" UNIQUE ("officerCode");


--
-- TOC entry 5413 (class 2606 OID 85021)
-- Name: users users_officerCode_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key77" UNIQUE ("officerCode");


--
-- TOC entry 5415 (class 2606 OID 85177)
-- Name: users users_officerCode_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key78" UNIQUE ("officerCode");


--
-- TOC entry 5417 (class 2606 OID 85019)
-- Name: users users_officerCode_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key79" UNIQUE ("officerCode");


--
-- TOC entry 5419 (class 2606 OID 85097)
-- Name: users users_officerCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key8" UNIQUE ("officerCode");


--
-- TOC entry 5421 (class 2606 OID 85179)
-- Name: users users_officerCode_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key80" UNIQUE ("officerCode");


--
-- TOC entry 5423 (class 2606 OID 85181)
-- Name: users users_officerCode_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key81" UNIQUE ("officerCode");


--
-- TOC entry 5425 (class 2606 OID 85017)
-- Name: users users_officerCode_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key82" UNIQUE ("officerCode");


--
-- TOC entry 5427 (class 2606 OID 85183)
-- Name: users users_officerCode_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key83" UNIQUE ("officerCode");


--
-- TOC entry 5429 (class 2606 OID 85185)
-- Name: users users_officerCode_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key84" UNIQUE ("officerCode");


--
-- TOC entry 5431 (class 2606 OID 85015)
-- Name: users users_officerCode_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key85" UNIQUE ("officerCode");


--
-- TOC entry 5433 (class 2606 OID 85187)
-- Name: users users_officerCode_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key86" UNIQUE ("officerCode");


--
-- TOC entry 5435 (class 2606 OID 85079)
-- Name: users users_officerCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key9" UNIQUE ("officerCode");


--
-- TOC entry 5437 (class 2606 OID 37154)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5624 (class 1259 OID 85653)
-- Name: idx_app_histories_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_app_histories_applicationid ON public.application_histories USING btree ("applicationId");


--
-- TOC entry 5602 (class 1259 OID 85646)
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status ON public.applications USING btree (status);


--
-- TOC entry 5603 (class 1259 OID 85649)
-- Name: idx_applications_status_submittedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status_submittedat ON public.applications USING btree (status, "submittedAt");


--
-- TOC entry 5604 (class 1259 OID 85647)
-- Name: idx_applications_submittedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_submittedat ON public.applications USING btree ("submittedAt");


--
-- TOC entry 5605 (class 1259 OID 85645)
-- Name: idx_applications_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_userid ON public.applications USING btree ("userId");


--
-- TOC entry 5606 (class 1259 OID 85648)
-- Name: idx_applications_userid_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_userid_status ON public.applications USING btree ("userId", status);


--
-- TOC entry 4950 (class 1259 OID 16720)
-- Name: idx_audit_hanh_dong; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_hanh_dong ON public.audit_logs USING btree (hanh_dong);


--
-- TOC entry 4951 (class 1259 OID 16719)
-- Name: idx_audit_nguoi_dung; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_nguoi_dung ON public.audit_logs USING btree (nguoi_dung_id);


--
-- TOC entry 4952 (class 1259 OID 16721)
-- Name: idx_audit_thoi_gian; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_thoi_gian ON public.audit_logs USING btree (thoi_gian);


--
-- TOC entry 5616 (class 1259 OID 85654)
-- Name: idx_comments_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_applicationid ON public.comments USING btree ("applicationId");


--
-- TOC entry 5609 (class 1259 OID 85650)
-- Name: idx_documents_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_applicationid ON public.documents USING btree ("applicationId");


--
-- TOC entry 5610 (class 1259 OID 85651)
-- Name: idx_notifications_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_userid ON public.notifications USING btree ("userId");


--
-- TOC entry 5611 (class 1259 OID 85652)
-- Name: idx_notifications_userid_isread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_userid_isread ON public.notifications USING btree ("userId", "isRead");


--
-- TOC entry 5628 (class 1259 OID 85656)
-- Name: idx_payments_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_applicationid ON public.payments USING btree ("applicationId");


--
-- TOC entry 5629 (class 1259 OID 85655)
-- Name: idx_payments_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_userid ON public.payments USING btree ("userId");


--
-- TOC entry 5625 (class 1259 OID 85658)
-- Name: idx_posts_ispublished_publishedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_ispublished_publishedat ON public.posts USING btree ("isPublished", "publishedAt");


--
-- TOC entry 5619 (class 1259 OID 85657)
-- Name: idx_schedules_userid_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_userid_date ON public.schedules USING btree ("userId", date);


--
-- TOC entry 4953 (class 1259 OID 85660)
-- Name: idx_users_cccd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_cccd ON public.users USING btree (cccd);


--
-- TOC entry 4954 (class 1259 OID 85659)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4955 (class 1259 OID 85661)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5760 (class 2606 OID 85455)
-- Name: ai_logs ai_logs_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT "ai_logs_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5762 (class 2606 OID 85481)
-- Name: application_histories application_histories_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5763 (class 2606 OID 85476)
-- Name: application_histories application_histories_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5752 (class 2606 OID 85396)
-- Name: applications applications_officerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5753 (class 2606 OID 85391)
-- Name: applications applications_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5754 (class 2606 OID 85386)
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5758 (class 2606 OID 85438)
-- Name: comments comments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5759 (class 2606 OID 85443)
-- Name: comments comments_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5755 (class 2606 OID 85413)
-- Name: documents documents_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5756 (class 2606 OID 85429)
-- Name: notifications notifications_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE;


--
-- TOC entry 5757 (class 2606 OID 85424)
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5765 (class 2606 OID 85624)
-- Name: payments payments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5766 (class 2606 OID 85629)
-- Name: payments payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5764 (class 2606 OID 85494)
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5761 (class 2606 OID 85462)
-- Name: schedules schedules_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-05-13 11:30:22

--
-- PostgreSQL database dump complete
--

\unrestrict btsAlahNrDGusawZc9tCLDE3QMP6Bfi7FOgv2NpnB1Pxr0kOZdSj53fdLcsadnW

