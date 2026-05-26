--
-- PostgreSQL database dump
--

\restrict nw3qHtNLhgZ6LvoeTG4y11mhKN0Rob9E4l09cwxVKx5oHLCHSMVcZagIEfyT6Cl

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-26 15:25:13

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
-- TOC entry 5969 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 964 (class 1247 OID 65040)
-- Name: enum_applications_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_applications_paymentStatus" AS ENUM (
    'FREE',
    'UNPAID',
    'PAID'
);


ALTER TYPE public."enum_applications_paymentStatus" OWNER TO postgres;

--
-- TOC entry 922 (class 1247 OID 37181)
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
-- TOC entry 961 (class 1247 OID 44810)
-- Name: enum_comments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_comments_status AS ENUM (
    'pending',
    'resolved',
    'dismissed'
);


ALTER TYPE public.enum_comments_status OWNER TO postgres;

--
-- TOC entry 934 (class 1247 OID 37268)
-- Name: enum_comments_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_comments_type AS ENUM (
    'internal',
    'public',
    'feedback'
);


ALTER TYPE public.enum_comments_type OWNER TO postgres;

--
-- TOC entry 955 (class 1247 OID 44455)
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
-- TOC entry 949 (class 1247 OID 37351)
-- Name: enum_posts_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_posts_category AS ENUM (
    'Tin tức',
    'Hướng dẫn',
    'Thông báo'
);


ALTER TYPE public.enum_posts_category OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 25374)
-- Name: enum_schedules_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_priority AS ENUM (
    'normal',
    'urgent'
);


ALTER TYPE public.enum_schedules_priority OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 25366)
-- Name: enum_schedules_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_schedules_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_schedules_status OWNER TO postgres;

--
-- TOC entry 907 (class 1247 OID 19509)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'citizen',
    'officer',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- TOC entry 901 (class 1247 OID 16470)
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
-- TOC entry 886 (class 1247 OID 16422)
-- Name: kenh_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kenh_enum AS ENUM (
    'EMAIL',
    'SMS',
    'IN_APP'
);


ALTER TYPE public.kenh_enum OWNER TO postgres;

--
-- TOC entry 898 (class 1247 OID 16460)
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
-- TOC entry 895 (class 1247 OID 16454)
-- Name: loai_cmt_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loai_cmt_enum AS ENUM (
    'INTERNAL',
    'FEEDBACK'
);


ALTER TYPE public.loai_cmt_enum OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 16444)
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
-- TOC entry 889 (class 1247 OID 16430)
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
-- TOC entry 883 (class 1247 OID 16408)
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
-- TOC entry 880 (class 1247 OID 16401)
-- Name: vai_tro_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vai_tro_enum AS ENUM (
    'CITIZEN',
    'OFFICER',
    'ADMIN'
);


ALTER TYPE public.vai_tro_enum OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 16722)
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
-- TOC entry 247 (class 1255 OID 16729)
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
-- TOC entry 246 (class 1255 OID 16727)
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
    "updatedAt" timestamp with time zone NOT NULL
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
    "feeTotal" integer DEFAULT 0,
    "paymentDeadline" timestamp with time zone
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
    "applicationId" uuid,
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
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 85663)
-- Name: form_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_templates (
    id uuid NOT NULL,
    "serviceId" uuid NOT NULL,
    "documentName" character varying(255) NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "fileUrl" character varying(255) NOT NULL,
    "extractedFields" jsonb DEFAULT '[]'::jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.form_templates OWNER TO postgres;

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
    "updatedAt" timestamp with time zone NOT NULL
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
    "currentFee" integer DEFAULT 0,
    procedures text,
    workflow text
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
-- TOC entry 5958 (class 0 OID 37297)
-- Dependencies: 229
-- Data for Name: ai_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_logs (id, "applicationId", type, input, output, confidence, "durationMs", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5960 (class 0 OID 37328)
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
31a9365c-41d8-4012-a3ca-77820b27d192	9601d723-4af3-4f2d-a4db-14f0e73e4fb6	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-15 11:13:06.191+07	2026-05-15 11:13:06.191+07
755b13f6-ef22-4147-9914-13597d701f72	d6b0e820-5537-4206-9b96-3ee7ee5e5160	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-15 11:28:47.859+07	2026-05-15 11:28:47.859+07
d136fb59-d047-4f43-a614-d8fd5a11d0fb	d6b0e820-5537-4206-9b96-3ee7ee5e5160	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-15 11:29:52.138+07	2026-05-15 11:29:52.138+07
ce97ea21-25a8-4424-90b2-d5157c01a5c3	6814a8dd-711c-45bd-beaa-7c6336163589	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-15 11:38:28.811+07	2026-05-15 11:38:28.811+07
cf4ac20d-6e4d-41e7-8fae-7b4ab52c0834	2b139c7f-6664-41b1-935f-62dbf567a115	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-15 11:45:12.591+07	2026-05-15 11:45:12.591+07
dd601600-25e5-46ee-adcd-fdb6da699de4	4c98c43a-96ae-434f-a155-a4686eaabc85	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-16 09:24:22.856+07	2026-05-16 09:24:22.856+07
c311ffd7-4362-4a7c-8f55-e83163c89746	0efd3e1c-f467-4d31-8326-3ade00167f12	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-16 09:30:30.059+07	2026-05-16 09:30:30.059+07
cf6f4687-cbd0-49bc-afea-4ed52f8f8225	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-16 09:31:26.657+07	2026-05-16 09:31:26.657+07
2ae10d54-35e7-4210-959c-9d87e6c47aea	49b2d779-0f1a-41c7-bf50-c66bc0ded437	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-16 09:31:30.839+07	2026-05-16 09:31:30.839+07
0d7b931a-dc76-4633-bea0-ce226942c03d	4c98c43a-96ae-434f-a155-a4686eaabc85	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-16 09:58:15.925+07	2026-05-16 09:58:15.925+07
c7c5c32c-c1ff-41ba-8d03-1733e86cb730	6814a8dd-711c-45bd-beaa-7c6336163589	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Từ chối hồ sơ	a	2026-05-16 09:59:19.583+07	2026-05-16 09:59:19.583+07
1a073eb2-54c0-4e9c-9758-4adaae8a237c	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-16 10:00:44.063+07	2026-05-16 10:00:44.063+07
4edd363d-e605-43e6-9fe9-ba696d653999	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-16 10:01:22.344+07	2026-05-16 10:01:22.344+07
5906602c-9558-46c6-ab64-3cadaa5a0dce	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-17 22:59:16.553+07	2026-05-17 22:59:16.553+07
d92df683-b329-4584-84e9-feeda2faa9a8	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-17 23:01:58.341+07	2026-05-17 23:01:58.341+07
e5c9cd11-0eb2-4c16-8354-6ee5ecb0b7da	71aabd81-735b-4f96-8aaa-aada37377855	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-18 10:26:17.263+07	2026-05-18 10:26:17.263+07
0bfb7bf6-5d72-492f-b61e-bfafd1d16367	71aabd81-735b-4f96-8aaa-aada37377855	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Từ chối hồ sơ	Không đủ giấy tờ, bổ dung thêm	2026-05-18 10:30:34.756+07	2026-05-18 10:30:34.756+07
f89f3047-de6a-46d6-9ddb-cb43c704d656	e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-18 11:54:49.46+07	2026-05-18 11:54:49.46+07
74741c45-5ac6-4d2c-bd35-2fb0273dbe19	e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-18 11:55:36.192+07	2026-05-18 11:55:36.192+07
2419c022-c87a-4c4d-b380-3e532826932a	2c582378-7d7d-432e-9aef-50725604209f	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-18 12:02:57.268+07	2026-05-18 12:02:57.268+07
0343ae3a-e4b2-4897-93e5-468d7741bb31	2c582378-7d7d-432e-9aef-50725604209f	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-18 12:03:09.113+07	2026-05-18 12:03:09.113+07
ac977040-a286-44fa-826a-144548af0752	9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-19 09:22:34.933+07	2026-05-19 09:22:34.933+07
085a6d44-d1cd-44fa-874c-1f6528b250dc	9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-19 09:23:07.575+07	2026-05-19 09:23:07.575+07
03ffbd3f-2151-43dd-8075-27e21c0e327f	63c41e18-f075-4054-aa6c-d78a23e96dba	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-19 10:41:53.62+07	2026-05-19 10:41:53.62+07
a65da93c-fcce-434f-9e02-9a377ca2313e	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-19 10:46:46.517+07	2026-05-19 10:46:46.517+07
797ed76a-f637-4d81-b093-13a932c40eae	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-19 10:47:08.841+07	2026-05-19 10:47:08.841+07
875b6257-f683-4c3f-bbd4-fc26cd9b7fdd	63c41e18-f075-4054-aa6c-d78a23e96dba	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-19 10:47:12.798+07	2026-05-19 10:47:12.798+07
1281d7bc-4e8d-40d0-b847-916b37e121a6	836cbd22-71f4-47a3-93fe-cc338af690cc	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-25 15:38:54.266+07	2026-05-25 15:38:54.266+07
6251c6b1-31fa-4165-b1e4-4e86b1bb1474	8843a47e-36e1-469b-a04b-33656b1aff82	2688bdb5-bf12-447d-98da-de41be9af9c2	Nộp hồ sơ	Công dân nộp hồ sơ trực tuyến	2026-05-25 15:41:17.331+07	2026-05-25 15:41:17.331+07
5a01e169-d7b6-436d-9dd5-a177b8f84e75	8843a47e-36e1-469b-a04b-33656b1aff82	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Duyệt hồ sơ	Duyệt thành công	2026-05-25 15:45:05.589+07	2026-05-25 15:45:05.589+07
\.


--
-- TOC entry 5954 (class 0 OID 37195)
-- Dependencies: 225
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, "applicationCode", "userId", "serviceId", "officerId", "formData", status, "cancelReason", "rejectReason", "officerNote", "submittedAt", "completedAt", deadline, rating, "ratingContent", "createdAt", "updatedAt", "paymentStatus", "paymentCode", copies, "feeTotal", "paymentDeadline") FROM stdin;
8bc481da-abd4-4302-b3ac-fee6466e05d6	HS-2026-000006	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "MAI VIỆT DŨNG", "email": "", "phone": "0977474837", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOÃN KỲ", "hometown": "Việt Nam", "idNumber": "094205001245", "soHoKhau": "240415174", "cmndChuHo": "013319049", "issueDate": "2020-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiChuyenDen": "Thanh Bù", "noiThuongTru": "Số 80 P. Mai Dịch Q. Cầu Giấy", "ngayChuyenDen": "2009-12-08", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-10 20:39:42.118+07	2026-05-10 20:46:19.443+07	2026-05-11 20:39:42.118+07	4	Hệ thống ổn định, thông báo SMS kịp thời.	2026-05-10 20:39:41.991+07	2026-05-18 09:56:06.332+07	FREE	\N	1	0	\N
544cf189-664b-45ab-9d03-cf575ec5da5d	HS-2026-000002	4197d2bc-3f97-4729-8334-230047d5eaf8	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "kid14190@gmail.com", "phone": "0988888777", "fullName": "ABC", "idNumber": "1111111111"}	REJECTED	\N	ko	Duyệt thành công	2026-04-14 13:36:25.052+07	2026-04-14 13:36:42.013+07	2026-04-15 13:36:25.052+07	\N	\N	2026-04-14 13:36:24.921+07	2026-04-14 13:37:07.018+07	FREE	\N	1	0	\N
0efd3e1c-f467-4d31-8326-3ade00167f12	HS-2026-000007	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "NGUYỄN NGỌC", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOAN KỲ", "idNumber": "094205001245", "soHoKhau": "571165430", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiThuongTru": "[không rõ]", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-11 09:32:25.374+07	2026-05-16 09:30:30.052+07	2026-05-12 09:32:25.374+07	5	Rất hài lòng với thái độ phục vụ của cán bộ.	2026-05-11 09:32:25.075+07	2026-05-18 09:56:06.336+07	FREE	\N	1	0	\N
4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	HS-2026-000008	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "1985-03-12", "cccd": "36227097076416", "email": "", "phone": "0767265062", "danToc": "Kinh", "gender": "Nam", "soBHXH": "7910002781", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "kinhGui": "Trung tâm Dịch vụ việc làm thành phố Hồ Chí Minh", "tonGiao": "Không", "fullName": "TRIỆU DOÃN KỲ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "nganHang": "Ngân hàng Đông Á", "issueDate": "2020-01-30", "noiLapDon": "Tp. Hồ Chí Minh", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "ngayLapDon": "2026-05-10", "ngheNghiep": "Công nhân", "noiLamViec": "Công ty TNHH ABC", "soTaiKhoan": "1234567890", "choOHienNay": "Như trên", "nationality": "Việt Nam", "phoneNumber": "0902388187", "noiThuongTru": "123 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP.HCM", "issueDateCCCD": "2008-01-23", "loaiHinhDonVi": "Doanh nghiệp (nhà nước)", "issuePlaceCCCD": "Công an tỉnh", "ngayChamDutHDLD": "2026-04-30", "thoiGianDongBHTN": "12 tháng", "trinhDoChuyenMon": "Không có bằng cấp, chứng chỉ", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "nguyenNhanChamDutHDLD": "Hết hạn HĐLĐ/HĐLV", "noiDangKyKhamChuaBenh": "Bệnh viện Quận 1", "viTriCongViecTruocThatNghiep": "Lao động phổ thông"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-11 09:36:58.022+07	2026-05-16 09:31:26.648+07	2026-05-12 09:36:58.022+07	5	Dịch vụ công trực tuyến rất nhanh chóng và tiện lợi.	2026-05-11 09:36:57.766+07	2026-05-18 09:56:06.314+07	FREE	\N	1	0	\N
adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	HS-2026-000005	4197d2bc-3f97-4729-8334-230047d5eaf8	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "citizen@example.com", "phone": "0901234567", "fullName": "Trần Thị Công Dân", "idNumber": "079200012345"}	REJECTED	\N	thiếu tin cậy	\N	2026-05-04 10:17:00.986+07	\N	2026-05-05 10:17:00.986+07	\N	\N	2026-05-04 10:17:00.819+07	2026-05-10 20:45:48.966+07	FREE	\N	1	0	\N
e011db3b-64b5-4cc7-9885-aa66ffaa4197	HS-2026-000004	2688bdb5-bf12-447d-98da-de41be9af9c2	e0a41035-c7f1-4f07-a266-d3a1d318a3eb	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "trieukyst5678@gmail.com", "phone": "63543543534", "fullName": "Triệu Đoan Kỳ", "idNumber": "094205001245"}	NEED_MORE	\N	\N	\N	2026-04-22 10:31:18.592+07	\N	2026-04-25 10:31:18.592+07	\N	\N	2026-04-22 10:31:18.453+07	2026-05-10 20:46:02.694+07	FREE	\N	1	0	\N
b2aa413e-f832-4b46-9716-92f2c4b89057	HS-2026-000011	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	\N	{"dob": "1989-07-23", "cccd": "362279997.076.416", "email": "", "phone": "0767265062", "gender": "Nữ", "soBHXH": "7915040578", "address": "Nhơn Nghĩa, Phong Điền, TP. Cần Thơ", "bankName": "Đông Á", "fullName": "[không rõ]", "idNumber": "362279997.076.416", "religion": "Không", "ethnicity": "Kinh", "issueDate": "2008-08-25", "issuePlace": "Cần Thơ", "signerName": "[không rõ]", "phoneNumber": "0903338187", "documentDate": "[không rõ]", "employerName": "[không rõ]", "currentAddress": "[không rõ]", "terminationDate": "[không rõ]", "bankAccountNumber": "[không rõ]", "medicalRegistrationPlace": "[không rõ]"}	PENDING	\N	\N	\N	2026-05-11 09:54:32.842+07	\N	2026-05-12 09:54:32.842+07	\N	\N	2026-05-11 09:54:32.529+07	2026-05-11 09:54:32.843+07	FREE	\N	1	0	\N
e508e868-2681-496f-9969-c6dd22c1f963	HS-2026-000001	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	9bb9280a-e545-4853-934b-e582b504904b	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "nguyenhuyhoang@gmail.com", "phone": "0955384639", "fullName": "Nguyễn Huy Hoàng", "idNumber": "0978367829"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-14 13:23:00.081+07	2026-04-14 13:23:40.178+07	2026-04-16 13:23:00.081+07	5	Giao diện dễ sử dụng, tôi không gặp khó khăn gì.	2026-04-14 13:22:59.967+07	2026-05-18 09:56:06.326+07	FREE	\N	1	0	\N
49b2d779-0f1a-41c7-bf50-c66bc0ded437	HS-2026-000010	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "chuHo": "NGUYỄN NGỌC", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOÃN KỲ", "idNumber": "094205001245", "soHoKhau": "571165430", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-11 09:47:52.825+07	2026-05-16 09:31:30.831+07	2026-05-12 09:47:52.825+07	5	Dịch vụ công trực tuyến rất nhanh chóng và tiện lợi.	2026-05-11 09:47:52.559+07	2026-05-18 09:56:06.329+07	FREE	\N	1	0	\N
5b12c364-42a1-4596-927d-60ec9baf5e21	HS-2026-000003	4197d2bc-3f97-4729-8334-230047d5eaf8	dc6bae36-43b2-4d9e-b217-81dacec10953	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "kid14190@gmail.com", "phone": "09687463829", "fullName": "Triệu Đoan Kỳ", "idNumber": "094205001245"}	COMPLETED	\N	\N	Duyệt thành công	2026-04-22 10:03:49.291+07	2026-04-24 08:27:29.649+07	2026-04-23 10:03:49.291+07	5	Rất hài lòng với thái độ phục vụ của cán bộ.	2026-04-22 10:03:49.149+07	2026-05-18 09:56:06.334+07	FREE	\N	1	0	\N
9601d723-4af3-4f2d-a4db-14f0e73e4fb6	HS-2026-000012	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	\N	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tổ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "purpose": "Để mua bán tài sản, vay vốn ngân hàng", "fullName": "Triệu Đoan Kỳ", "hometown": "Việt Nam", "idNumber": "094205001245", "issueDate": "2026-01-30", "personDob": "2005-10-28", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "personCccd": "094205001245", "nationality": "Việt Nam", "personGender": "Nam", "maritalStatus": "Hiện tại chưa đăng ký kết hôn với ai", "personAddress": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "personFullName": "Triệu Đoan Kỳ", "declarationDate": "2026-04-30", "personIssueDate": "2026-01-30", "personIssuePlace": "Bộ Công An", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "personNationality": "Việt Nam"}	PENDING	\N	\N	\N	2026-05-15 11:13:06.185+07	\N	2026-05-18 11:13:06.185+07	\N	\N	2026-05-15 11:13:05.902+07	2026-05-15 11:13:06.186+07	FREE	\N	1	0	\N
2b139c7f-6664-41b1-935f-62dbf567a115	HS-2026-000015	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	\N	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "07678265063", "gender": "Nam", "address": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "purpose": "Để mua bán tài sản, vay vốn ngân hàng", "fullName": "TRIỆU DOAN KỲ", "idNumber": "094205001245", "soGiayTo": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "Bộ Công An", "nationality": "Việt Nam", "maritalStatus": "Hiện tại chưa đăng ký kết hôn với ai", "declarationDate": "2026-04-30", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	PENDING	\N	\N	\N	2026-05-15 11:45:12.584+07	\N	2026-05-18 11:45:12.584+07	\N	\N	2026-05-15 11:45:12.207+07	2026-05-15 11:45:33.257+07	PAID	PAY20260515-61516	1	15000	2026-05-18 11:45:12.584+07
6814a8dd-711c-45bd-beaa-7c6336163589	HS-2026-000014	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "gender": "Nam", "address": "SỐ 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "purpose": "Để mua bán tài sản, vay vốn ngân hàng", "fullName": "TRIỆU DOÃN KÝ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "issueDate": "2026-01-30", "personDob": "2005-10-28", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "personGender": "Nam", "maritalStatus": "Hiện tại chưa đăng ký kết hôn với ai", "personFullName": "Triệu Doãn Ký", "personIdNumber": "094205001245", "declarationDate": "2026-04-30", "personEthnicity": "Kinh", "personResidence": "SỐ 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "recipientAddress": "UBND Phường Mỹ Bình, Thành phố Long Xuyên, Tỉnh An Giang", "applicantFullName": "Triệu Doãn Ký", "applicantIdNumber": "094205001245", "noiDangKyKhaiSinh": "Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "personIdIssueDate": "2026-01-30", "personNationality": "Việt Nam", "applicantResidence": "SỐ 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "personIdIssuePlace": "BỘ CÔNG AN", "requesterSignatureName": "Triệu Doãn Ký"}	REJECTED	\N	a	\N	2026-05-15 11:38:28.806+07	\N	2026-05-18 11:38:28.806+07	\N	\N	2026-05-15 11:38:28.605+07	2026-05-16 09:59:19.577+07	FREE	\N	1	0	\N
d6b0e820-5537-4206-9b96-3ee7ee5e5160	HS-2026-000013	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "kid14190@gmail.com", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOÃN KỲ", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "requestingDob": "2005-10-28", "requestingCccd": "094205001245", "declarationDate": "2026-04-30", "declarationPlace": "Phường An Bình", "requestingGender": "Nam", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "requestingAddress": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "requestingFullName": "Triệu Đoan Kỳ", "purposeOfDeclaration": "Để mua bán tài sản, vay vốn ngân hàng", "requestingNationality": "Việt Nam", "requestingCccdIssueDate": "2026-01-30", "maritalStatusDeclaration": "Hiện tại chưa đăng ký kết hôn với ai"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-15 11:28:47.853+07	2026-05-15 11:29:52.126+07	2026-05-18 11:28:47.853+07	4	Rất hài lòng với thái độ phục vụ của cán bộ.	2026-05-15 11:28:47.536+07	2026-05-18 09:56:06.351+07	FREE	\N	1	0	\N
4c98c43a-96ae-434f-a155-a4686eaabc85	HS-2026-000016	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOAN KỲ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-16 09:24:22.846+07	2026-05-16 09:58:15.903+07	2026-05-19 09:24:22.846+07	5	Dịch vụ công trực tuyến rất nhanh chóng và tiện lợi.	2026-05-16 09:24:22.576+07	2026-05-18 09:56:06.353+07	PAID	PAY20260516-45434	1	15000	2026-05-19 09:24:22.846+07
5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	HS-2026-000018	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU ĐOAN KỲ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "applicantDob": "2005-10-28", "applicantGender": "Nam", "applicantIdType": "CCCD", "declarationDate": "2026-04-30", "applicantAddress": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "declarationPlace": "Phường Mỹ Bình", "applicantFullName": "Triệu Đoan Kỳ", "applicantIdNumber": "094205001245", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "applicantEthnicity": "Kinh", "applicantIdIssueDate": "2026-01-30", "applicantNationality": "Việt Nam", "purposeOfDeclaration": "Để mua bán tài sản, vay vốn ngân hàng", "applicantIdIssuePlace": "Bộ Công An", "recipientOrganization": "UBND Phường Mỹ Bình, Bình Thạnh", "maritalStatusDeclaration": "Hiện tại chưa đăng ký kết hôn với ai"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-17 22:59:16.547+07	2026-05-17 23:01:58.334+07	2026-05-20 22:59:16.547+07	4	Rất hài lòng với thái độ phục vụ của cán bộ.	2026-05-17 22:59:16.251+07	2026-05-18 09:56:06.357+07	PAID	PAY20260517-68616	1	15000	2026-05-20 22:59:16.547+07
b82a90a7-f864-426b-b6a7-f064104d9443	HS-2026-000009	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "danToc": "Kinh", "gender": "Nam", "soBHXH": "7912050271", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "tonGiao": "Không", "fullName": "Triệu Đoàn Kỳ", "hometown": "Việt Nam", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "ngayLamDon": "[không rõ]", "soTaiKhoan": "tại ngân hàng Đông Á", "nationality": "Việt Nam", "phoneNumber": "0902188187", "loaiHinhDonVi": "Đơn vị sự nghiệp công lập", "thoiGianDongBHTN": "3 tháng", "trinhDoChuyenMon": "Không có bằng cấp, chứng chỉ", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "issueDate_cccd_form": "2026-01-30", "issuePlace_cccd_form": "Cần Thơ", "noiDangKyKhamChuaBenh": "[không rõ]", "viTriCongViecTruocThatNghiep": "Lãnh đạo"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-11 09:46:17.579+07	2026-05-11 09:55:44.657+07	2026-05-12 09:46:17.579+07	5	Mong có thêm nhiều dịch vụ công trực tuyến như thế này.	2026-05-11 09:46:17.331+07	2026-05-18 09:56:06.338+07	FREE	\N	1	0	\N
7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	HS-2026-000017	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"to": "UBND Phường Mỹ Bình, Thành phố Long Xuyên, Tỉnh An Giang", "dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265062", "gender": "Nam", "address": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "purpose": "Để mua bán tài sản, vay vốn ngân hàng.", "fullName": "TRIỆU ĐOÀN KỶ", "idNumber": "094205001245", "ethnicity": "Kinh", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "idIssueDate": "2026-01-30", "nationality": "Việt Nam", "documentType": "Tờ khai xác nhận tình trạng hôn nhân", "idIssuePlace": "Bộ Công An", "applicantName": "Triệu Đoàn Kỷ", "maritalStatus": "Hiện tại chưa đăng ký kết hôn với ai.", "declarationDate": "2026-04-30", "currentResidence": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-16 10:00:44.06+07	2026-05-16 10:01:22.326+07	2026-05-19 10:00:44.06+07	5	Giao diện dễ sử dụng, tôi không gặp khó khăn gì.	2026-05-16 10:00:43.911+07	2026-05-18 10:14:40.075+07	PAID	PAY20260516-88508	1	15000	2026-05-19 10:00:44.06+07
63c41e18-f075-4054-aa6c-d78a23e96dba	HS-2026-000023	2688bdb5-bf12-447d-98da-de41be9af9c2	bb8025ff-c0f3-475a-bc46-9436db0403ff	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "class": "23DTHA3", "email": "", "major": "Hệ thống thông tin", "phone": "0151452455", "gender": "Nam", "signer": "ThS. Trần Nguyễn Quỳnh Lâm", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "faculty": "Công nghệ Thông tin", "purpose": "bổ túc hồ sơ cá nhân", "fullName": "TRIỆU ĐOAN KỲ", "idNumber": "094205001245", "soGiayTo": "2026/GXN-HUTECH", "issueDate": "2026-05-10", "studentId": "2380601179", "expiryDate": "2026-11-10", "issuePlace": "BỘ CÔNG AN", "issuingBody": "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)", "nationality": "Việt Nam", "documentType": "Giấy Xác Nhận Sinh Viên", "trainingSystem": "Đại học chính quy", "validityPeriod": "06 tháng", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "currentYearOfStudy": "3"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-19 10:41:53.614+07	2026-05-19 10:47:12.789+07	2026-05-20 10:41:53.614+07	\N	\N	2026-05-19 10:41:53.272+07	2026-05-19 10:47:12.789+07	PAID	PAY20260519-12645	1	5000	2026-05-22 10:41:53.614+07
71aabd81-735b-4f96-8aaa-aada37377855	HS-2026-000019	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "01214652564", "gender": "Nam", "address": "Số 214/38, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU DOAN KỲ", "idNumber": "094205001245", "issueDate": "2026-01-30", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "noiLamToKhai": "Phường Mỹ Xuyên", "kinhGuiCoQuan": "UBND Phường Mỹ Xuyên, Bình Thạnh", "mucDichSuDung": "Để mua bán tài sản, vay vốn ngân hàng", "ngayLamToKhai": "2026-04-30", "hoTenNguoiYeuCau": "Triệu Doan Kỳ", "nguoiYeuCauKyTen": "Triệu Doan Kỳ", "tinhTrangHonNhan": "Hiện tại chưa đăng ký kết hôn với ai", "danTocNguoiYeuCau": "Kinh", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "gioiTinhNguoiYeuCau": "Nam", "ngaySinhNguoiYeuCau": "2005-10-28", "noiCuTruNguoiYeuCau": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "quocTichNguoiYeuCau": "Việt Nam", "giayToTuyThanNguoiYeuCau": "CCCD 094205001245", "noiCuTruChiTietNguoiYeuCau": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "giayToTuyThanChiTietNguoiYeuCau": "CCCD số 094205001245 do Bộ Công An cấp ngày 2026-01-30"}	REJECTED	\N	Không đủ giấy tờ, bổ dung thêm	\N	2026-05-18 10:26:17.26+07	\N	2026-05-21 10:26:17.26+07	\N	\N	2026-05-18 10:26:17.106+07	2026-05-18 10:30:34.743+07	PAID	PAY20260518-29262	1	15000	2026-05-21 10:26:17.26+07
e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	HS-2026-000020	2688bdb5-bf12-447d-98da-de41be9af9c2	3beeff4f-e24d-4f0c-9c57-e74b568f08ec	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "", "phone": "0123124512", "fullName": "TRIEU DOAN KY", "idNumber": "094205001245", "soGiayTo": "Mẫu số 04", "faxVietNam": "028 3899 9998", "tenVietTat": "GCEA Việt Nam", "diaChiDuKien": "475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", "emailVietNam": "hello@gcea.vn", "faxNuocNgoai": "+33 1 23 45 67 90", "donViThucHien": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam", "tonChiMucDich": "Thúc đẩy giao lưu văn hóa, chia sẻ kiến thức về công nghệ nghệ thuật số.", "emailNuocNgoai": "contact@gcea.fr", "tenChuongTrinh": "Kết nối Không gian Số - Giao lưu Văn hóa Pháp Việt 2026", "websiteVietNam": "www.gcea.vn", "linhVucHoatDong": "Giao lưu văn hóa, phát triển nghệ thuật số và giáo dục sáng tạo.", "noiDungHoatDong": "Tổ chức các triển lãm nghệ thuật số tương tác; mở các khóa học và workshop ngắn hạn.", "dienThoaiVietNam": "028 3899 9999", "websiteNuocNgoai": "www.gcea.fr", "quaTrinhPhatTrien": "Thành lập năm 2010, GCEA đã phát triển mạng lưới trung tâm văn hóa tại 15 quốc gia.", "dienThoaiNuocNgoai": "+33 1 23 45 67 89", "diaChiTruSoNuocNgoai": "123 Đại lộ Champs-Élysées, Paris, Cộng hòa Pháp", "giayChungNhanThanhLap": "98765/QĐ-BNG", "tenCoQuanToChucNuocNgoai": "Hiệp hội Giao lưu Văn hóa Toàn cầu (GCEA)", "tenCoSoVanHoaVietNamTiengAnh": "GCEA Vietnam Digital Art Exchange Center", "tenCoSoVanHoaVietNamTiengViet": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-18 11:54:49.456+07	2026-05-18 11:55:36.186+07	2026-05-21 11:54:49.456+07	\N	\N	2026-05-18 11:54:49.305+07	2026-05-18 11:55:36.186+07	PAID	PAY20260518-24093	1	50000	2026-05-21 11:54:49.456+07
2c582378-7d7d-432e-9aef-50725604209f	HS-2026-000021	2688bdb5-bf12-447d-98da-de41be9af9c2	3beeff4f-e24d-4f0c-9c57-e74b568f08ec	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "", "phone": "0215148455", "fullName": "TRIEU DOAN KY", "idNumber": "094205001245", "soGiayTo": "Mẫu số 04", "faxVietNam": "028 3899 9998", "ngayLapDon": "2026-05-18", "tenVietTat": "GCEA Việt Nam", "diaChiDuKien": "475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", "emailVietNam": "hello@gcea.vn", "faxNuocNgoai": "+33 1 23 45 67 90", "donViThucHien": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam", "tonChiMucDich": "Thúc đẩy giao lưu văn hóa, chia sẻ kiến thức về công nghệ nghệ thuật số.", "emailNuocNgoai": "contact@gcea.fr", "tenChuongTrinh": "Kết nối Không gian Số - Giao lưu Văn hóa Pháp Việt 2026", "websiteVietNam": "www.gcea.vn", "linhVucHoatDong": "Giao lưu văn hóa, phát triển nghệ thuật số và giáo dục sáng tạo.", "noiDungHoatDong": "Tổ chức các triển lãm nghệ thuật số tương tác; mở các khóa học và workshop ngắn hạn.", "dienThoaiVietNam": "028 3899 9999", "websiteNuocNgoai": "www.gcea.fr", "quaTrinhPhatTrien": "Thành lập năm 2010, GCEA đã phát triển mạng lưới trung tâm văn hóa tại 15 quốc gia.", "dienThoaiNuocNgoai": "+33 1 23 45 67 89", "diaChiTruSoNuocNgoai": "123 Đại lộ Champs-Élysées, Paris, Cộng hòa Pháp", "soGiayChungNhanThanhLap": "98765/QĐ-BNG", "tenCoQuanToChucNuocNgoai": "Hiệp hội Giao lưu Văn hóa Toàn cầu (GCEA)", "tenCoSoVanHoaVietNamTiengAnh": "GCEA Vietnam Digital Art Exchange Center", "tenCoSoVanHoaVietNamTiengViet": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-18 12:02:57.258+07	2026-05-18 12:03:09.106+07	2026-05-21 12:02:57.258+07	\N	\N	2026-05-18 12:02:57.081+07	2026-05-25 15:21:10.615+07	PAID	PAY20260518-34036	1	50000	2026-05-21 12:02:57.258+07
9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	HS-2026-000022	2688bdb5-bf12-447d-98da-de41be9af9c2	3beeff4f-e24d-4f0c-9c57-e74b568f08ec	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"email": "", "phone": "0121112212", "fullName": "TRIEU DOAN KY", "idNumber": "094205001245", "formNumber": "04", "signerName": "Jean Dupont", "programName": "Kết nối Không gian Số - Giao lưu Văn hóa Pháp Việt 2026", "signerTitle": "Giám đốc Khu vực Châu Á", "documentType": "NỘI DUNG CHƯƠNG TRÌNH HOẠT ĐỘNG", "activityContent": "Tổ chức các triển lãm nghệ thuật số tương tác; mở các khóa học và workshop ngắn hạn.", "applicationDate": "2026-05-18", "operatingSector": "Giao lưu văn hóa, phát triển nghệ thuật số và giáo dục sáng tạo.", "implementingUnit": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam", "certificateNumber": "98765/QĐ-BNG", "establishmentYear": "2010", "vietnamFacilityFax": "028 3899 9998", "purposeAndObjective": "Thúc đẩy giao lưu văn hóa, chia sẻ kiến thức về công nghệ nghệ thuật số.", "vietnamFacilityEmail": "hello@gcea.vn", "vietnamFacilityPhone": "028 3899 9999", "foreignHeadquartersFax": "+33 1 23 45 67 90", "legalRepresentativeDob": "1985-08-15", "vietnamFacilityAddress": "475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", "vietnamFacilityWebsite": "www.gcea.vn", "foreignHeadquartersEmail": "contact@gcea.fr", "foreignHeadquartersPhone": "+33 1 23 45 67 89", "applicantOrganizationName": "Hiệp hội Giao lưu Văn hóa Toàn cầu (GCEA)", "legalRepresentativeGender": "Nam", "foreignHeadquartersAddress": "123 Đại lộ Champs-Élysées, Paris, Cộng hòa Pháp", "foreignHeadquartersWebsite": "www.gcea.fr", "vietnamFacilityNameEnglish": "GCEA Vietnam Digital Art Exchange Center", "legalRepresentativeFullName": "Jean Dupont", "vietnamFacilityAbbreviation": "GCEA Việt Nam", "vietnamFacilityNameVietnamese": "Trung tâm Giao lưu Nghệ thuật Số GCEA Việt Nam", "legalRepresentativeNationality": "Pháp", "legalRepresentativePassportNumber": "12AB34567", "legalRepresentativePassportIssueDate": "2022-05-10", "legalRepresentativePassportExpiryDate": "2032-05-10", "legalRepresentativePassportIssuePlace": "Paris, Pháp", "legalRepresentativeForeignPermanentAddress": "45 Rue de Rivoli, Paris, Pháp", "legalRepresentativeVietnamResidenceAddress": "Thảo Điền Pearl, Số 12 Quốc Hương, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-19 09:22:34.929+07	2026-05-19 09:23:07.566+07	2026-05-22 09:22:34.929+07	\N	\N	2026-05-19 09:22:34.749+07	2026-05-19 09:23:07.567+07	PAID	PAY20260519-32178	1	50000	2026-05-22 09:22:34.929+07
e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	HS-2026-000024	2688bdb5-bf12-447d-98da-de41be9af9c2	ad05eecc-aecb-42b4-913b-e2d40de887ab	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0000000000", "gender": "Nam", "address": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "noiChet": "Bệnh viện Nhân dân Gia Định, Số 1 Nơ Trang Long, Phường 7, Quận Bình Thạnh, Thành phố Hồ Chí Minh", "fullName": "TRIỆU ĐOAN KỲ", "hometown": "Cần Thơ", "idNumber": "094205001245", "ngayKhai": "2026-05-19", "soGiayTo": "1024/GBT", "issueDate": "2026-01-30", "noiTuVong": "Khoa Hồi sức tích cực, Bệnh viện Nhân dân Gia Định", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "nationality": "Việt Nam", "soGiayBaoTu": "1024/GBT", "tenNguoiChet": "TRIỆU VĂN PHÚC", "thoiGianChet": "08 giờ 30 phút, ngày 15 tháng 05 năm 2026", "cmndNguoiChet": "021345678", "nguoiYeuCauKy": "Triệu Đoan Kỳ", "coQuanNhanHoSo": "Ủy ban nhân dân Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh", "nguyenNhanChet": "Suy tim mãn tính", "tenNguoiYeuCau": "TRIỆU ĐOAN KỲ", "thoiGianTuVong": "08 giờ 30 phút, ngày 15 tháng 05 năm 2026", "cccdNguoiYeuCau": "094205001245", "danTocNguoiChet": "Kinh", "ngayCapGiayBaoTu": "2026-05-15", "nguoiKyGiayBaoTu": "BS. Nguyễn Trí Dũng", "nguyenNhanTuVong": "Suy tim mãn tính, nhồi máu cơ tim", "gioiTinhNguoiChet": "Nam", "ngaySinhNguoiChet": "1945-02-15", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "quocTichNguoiChet": "Việt Nam", "coQuanCapGiayBaoTu": "Bệnh viện Nhân dân Gia Định", "quanHeVoiNguoiChet": "Cháu nội", "noiCuTruNguoiYeuCau": "Số 214/38, Tỉnh Lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "ngayCapCmndNguoiChet": "2010-10-10", "noiThuongTruNguoiChet": "Số 123 Lê Văn Duyệt, Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh", "coQuanCapCmndNguoiChet": "Công an Thành phố Hồ Chí Minh", "ngayCapCccdNguoiYeuCau": "2026-01-30", "coQuanCapCccdNguoiYeuCau": "Bộ Công an", "noiCuTruCuoiCungNguoiChet": "Số 123 Lê Văn Duyệt, Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-19 10:46:46.514+07	2026-05-19 10:47:08.834+07	2026-05-21 10:46:46.514+07	\N	\N	2026-05-19 10:46:46.375+07	2026-05-19 10:47:08.835+07	FREE	\N	1	0	\N
836cbd22-71f4-47a3-93fe-cc338af690cc	HS-2026-000025	2688bdb5-bf12-447d-98da-de41be9af9c2	ad05eecc-aecb-42b4-913b-e2d40de887ab	\N	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0767265072", "gender": "Nam", "signer": "BS. Nguyễn Trí Dũng", "address": "Số 214/138, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "fullName": "TRIỆU VĂN PHÚC", "hometown": "Kinh", "idNumber": "094205001245", "soGiayTo": "1024/GBT", "cmndChuHo": "021345678", "deathDate": "2025-05-17", "deathTime": "20 giờ 30 phút", "issueDate": "2026-01-30", "deathPlace": "214/138, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "deceasedDob": "1954-01-01", "nationality": "Việt Nam", "applicantDob": "2005-10-28", "causeOfDeath": "Bệnh", "deceasedName": "Triệu Thanh Tâm", "applicantName": "Triệu Doan Ký", "deceasedGender": "Nam", "deceasedIdType": "CCCD", "applicantIdType": "CCCD", "applicantAddress": "Số 214/138, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "deceasedIdNumber": "076203016783", "applicantIdNumber": "094205001245", "deceasedEthnicity": "Kinh", "documentIssueDate": "2026-05-15", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ", "deceasedIdIssueDate": "2023-11-12", "deceasedLastAddress": "Số 214/138, Tỉnh lộ 934, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "deceasedNationality": "Việt Nam", "applicantIdIssueDate": "2026-01-30", "deceasedIdIssuePlace": "Bộ Công an", "applicantIdIssuePlace": "Bộ Công an", "relationshipToDeceased": "Con cháu", "deathNotificationNumber": "0246.3", "deathNotificationIssueDate": "2025-05-18", "deathNotificationIssuePlace": "UBND. Phường 11, Bình Thạnh"}	PENDING	\N	\N	\N	2026-05-25 15:38:54.26+07	\N	2026-05-27 15:38:54.26+07	\N	\N	2026-05-25 15:38:53.937+07	2026-05-25 15:38:54.26+07	FREE	\N	1	0	\N
8843a47e-36e1-469b-a04b-33656b1aff82	HS-2026-000026	2688bdb5-bf12-447d-98da-de41be9af9c2	c9957552-2050-417f-a07a-02633dc33696	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	{"dob": "2005-10-28", "cccd": "094205001245", "email": "", "phone": "0999776456", "gender": "Nam", "address": "Số 214/38, Ấp Thạnh Lợi, Mỹ Xuyên, Cần Thơ", "purpose": "Để mua bán tài sản, vay vốn ngân hàng", "fullName": "TRIỆU DOAN KỲ", "hometown": "Mỹ Xuyên, Cần Thơ", "idNumber": "094205001245", "issueDate": "2026-01-30", "recipient": "UBND Phường Mỹ Xuyên, Bình Thạnh", "expiryDate": "2030-10-28", "issuePlace": "BỘ CÔNG AN", "idIssueDate": "2026-01-30", "nationality": "Việt Nam", "idIssuePlace": "Bộ Công An", "maritalStatus": "Hiện tại chưa đăng ký kết hôn với ai", "declarationDate": "2026-04-30", "declarationPlace": "Phường Mỹ Xuyên", "noiDangKyKhaiSinh": "Mỹ Xuyên, Cần Thơ"}	COMPLETED	\N	\N	Duyệt thành công	2026-05-25 15:41:17.325+07	2026-05-25 15:45:05.579+07	2026-05-28 15:41:17.325+07	\N	\N	2026-05-25 15:41:17.111+07	2026-05-25 15:45:05.579+07	UNPAID	PAY20260525-56625	1	15000	2026-05-28 15:41:17.325+07
\.


--
-- TOC entry 5951 (class 0 OID 16701)
-- Dependencies: 222
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, nguoi_dung_id, ho_so_id, bang_lien_quan, ban_ghi_id, hanh_dong, du_lieu_cu, du_lieu_moi, dia_chi_ip, user_agent, thoi_gian) FROM stdin;
\.


--
-- TOC entry 5957 (class 0 OID 37273)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, "applicationId", "authorId", content, type, "createdAt", "updatedAt", topic, title, status) FROM stdin;
7f9f6337-0f4f-4d8c-b475-304d2c8b4645	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Tại khu phố 3, hẻm 123 thường xuyên có tình trạng tụ tập hát karaoke bằng loa kéo âm lượng lớn sau 22h đêm, gây ảnh hưởng đến giấc ngủ của người dân xung quanh. Đề nghị cơ quan chức năng xuống kiểm tra và nhắc nhở.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	An ninh trật tự	Tụ tập hát karaoke quá giờ quy định	pending
f3d26a3e-84f5-49b3-8045-9f5912c284e1	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Tại khu vực bãi đất trống hẻm 456 có rất nhiều người đem rác thải sinh hoạt và xà bần đến đổ trộm vào ban đêm. Bãi rác tự phát này gây bốc mùi hôi thối và mất mỹ quan đô thị. Mong chính quyền có biện pháp xử lý triệt để.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Môi trường	Rác thải đổ trộm tại hẻm 456	pending
1d34381c-2f12-48e3-851c-682e515a2dff	\N	2688bdb5-bf12-447d-98da-de41be9af9c2	Đèn giao thông tại ngã tư đường ABC giao với đường XYZ đã bị hỏng đèn đỏ hơn 3 ngày nay, gây lộn xộn và nguy cơ tai nạn giao thông vào giờ cao điểm. Kính mong cơ quan chức năng cử người sửa chữa gấp.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Giao thông đô thị	Hệ thống đèn tín hiệu giao thông hỏng	resolved
ee7f156d-3862-41c5-8f19-38d88f2dd1d4	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Tôi đến làm thủ tục xác nhận tình trạng hôn nhân vào sáng thứ 3 tuần trước. Tuy nhiên cán bộ tiếp nhận hồ sơ có thái độ chưa nhiệt tình, cáu gắt và hướng dẫn không rõ ràng khiến tôi phải đi lại nhiều lần để bổ sung giấy tờ. Mong cơ quan xem xét chấn chỉnh.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Thủ tục hành chính	Thái độ phục vụ của cán bộ	pending
231d8dbb-f25a-4e8d-9322-ae8a36bc6299	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Trước cửa nhà số 789 đường DEF có một đường ống nước máy bị vỡ từ sáng hôm qua, nước chảy lênh láng gây trơn trượt cho người đi đường và thất thoát nước sạch. Đề nghị công ty cấp nước xử lý.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Hạ tầng	Đường ống nước bị vỡ gây ngập lụt	resolved
e74a13c6-2bac-42b9-afa7-a5846c05e6f9	\N	2688bdb5-bf12-447d-98da-de41be9af9c2	Khu vực đường GHI có chợ tự phát mọc lên, người buôn bán lấn chiếm hết lòng lề đường, gây ùn tắc giao thông vào buổi sáng sớm và xả rác bừa bãi. Đề nghị dẹp bỏ chợ tự phát này.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	An ninh trật tự	Mất trật tự tại chợ tự phát	pending
0f7bd6e1-7407-475e-874d-f61652037a58	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Cơ sở sản xuất ở cuối hẻm 111 thường xuyên xả nước thải màu đen ngòm và bốc mùi hóa chất trực tiếp ra con kênh phía sau khu dân cư. Kính đề nghị phòng Tài nguyên Môi trường kiểm tra và xử phạt.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Môi trường	Xả nước thải chưa qua xử lý ra kênh	dismissed
b89ab0a6-1c71-4e82-8169-54892feea03b	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Khu vực công viên trung tâm hiện nay có quá ít thùng rác công cộng, dẫn đến tình trạng người dân đi dạo hay xả rác bừa bãi ra thảm cỏ. Đề nghị ban quản lý công viên bổ sung thêm thùng rác.	feedback	2026-05-18 09:49:01.975+07	2026-05-18 09:49:01.975+07	Khác	Kiến nghị lắp thêm thùng rác công cộng	pending
f0a64f1b-c33a-4f22-ad9e-5ab0d42146c3	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Gần đây tại khu vực chợ trung tâm phường thường xuyên xảy ra tình trạng mất trộm xe máy của người đi chợ. Đề nghị công an phường tăng cường tuần tra và lắp thêm camera an ninh.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	An ninh trật tự	Trộm cắp xe máy tại khu vực chợ	pending
d5375fb0-fc06-406d-8e86-3d9e03b40197	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Quán nhậu XYZ trên đường Lê Lợi thường xuyên mở cửa quá giờ, khách nhậu say xỉn la hét và đánh nhau làm mất trật tự công cộng. Mong cơ quan có thẩm quyền xử lý nghiêm.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	An ninh trật tự	Thường xuyên đánh nhau tại quán nhậu	pending
ab749486-fbde-4a41-9efb-ee1b00880545	\N	2688bdb5-bf12-447d-98da-de41be9af9c2	Có một số hộ dân ở bãi đất trống cuối khu phố 2 thường xuyên gom rác thải nhựa và cao su đốt vào chiều muộn, khói đen mù mịt bay vào khu dân cư gây khó thở. Đề nghị phường xuống nhắc nhở.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Môi trường	Đốt rác thải nhựa gây ô nhiễm không khí	resolved
d0e26577-0465-4fb5-9888-4761d4cbe572	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Hồ điều hòa của khu vực đang trở thành nơi tập kết rác thải của một số người dân thiếu ý thức. Nước hồ chuyển màu đen và bốc mùi hôi thối, ảnh hưởng sức khỏe người dân quanh hồ.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Môi trường	Khu vực hồ điều hòa bị xả rác bốc mùi	pending
bf9309cf-718a-4fd9-8e8a-e3ab7c65be31	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Các cửa hàng kinh doanh trên đường Nguyễn Huệ lấn chiếm toàn bộ vỉa hè để bày hàng và đậu xe cho khách, người đi bộ buộc phải đi xuống lòng đường rất nguy hiểm. Kính nghị cơ quan trật tự đô thị dọn dẹp vỉa hè.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Giao thông đô thị	Lấn chiếm vỉa hè làm nơi đỗ xe	pending
bc29e85f-4fbb-4fe1-b45f-ae82ce74af95	\N	2688bdb5-bf12-447d-98da-de41be9af9c2	Đường liên ấp hiện nay có rất nhiều xe tải chở vật liệu xây dựng chạy tốc độ cao, bóp còi inh ỏi bất kể ngày đêm, gây nguy hiểm cho trẻ em và người già. Mong có biện pháp hạn chế tốc độ.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Giao thông đô thị	Xe tải chạy quá tốc độ trong khu dân cư	pending
b28f98d9-52bb-4276-beca-d1997cc6a13b	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Khi tôi cố gắng nộp hồ sơ xin giấy phép xây dựng qua ứng dụng, đến bước đính kèm tệp tin thì hệ thống cứ báo lỗi và văng ra ngoài. Rất bất tiện, mong đội ngũ kỹ thuật sớm khắc phục.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Thủ tục hành chính	Ứng dụng dịch vụ công thường xuyên báo lỗi	pending
296a7b2b-eba7-4c4a-bd66-1ff3ffac9d05	\N	4197d2bc-3f97-4729-8334-230047d5eaf8	Tôi nộp hồ sơ đăng ký kinh doanh online nhưng bị trả lại với lý do chung chung là "Hồ sơ không hợp lệ" mà không chỉ rõ sai ở đâu để tôi sửa. Việc này gây mất thời gian cho công dân.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Thủ tục hành chính	Cán bộ từ chối hồ sơ không rõ lý do	resolved
4b29e207-6cd4-4fa8-ae15-c4f95a84803b	\N	2688bdb5-bf12-447d-98da-de41be9af9c2	Dãy cột đèn chiếu sáng công cộng từ số nhà 10 đến 50 trên đường Trần Phú đã bị cháy bóng hơn một tuần nay. Buổi tối đường rất tối, tiềm ẩn nguy cơ tai nạn giao thông và trộm cắp.	feedback	2026-05-18 09:52:37.634+07	2026-05-18 09:52:37.634+07	Hạ tầng	Bóng đèn đường bị cháy hỏng nhiều ngày	pending
fbe9f55e-c8f7-41e9-893d-2e53ee5923d4	\N	10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Sau đợt mưa bão vừa qua, đoạn đường bê tông vào hẻm 88 bị sụt lún tạo thành một hố sâu khá lớn. Người dân đã tạm che chắn nhưng cần chính quyền hỗ trợ sửa chữa để đảm bảo lưu thông.	feedback	2026-05-18 09:52:37.634+07	2026-05-25 15:49:34.503+07	Hạ tầng	Đường nội bộ khu dân cư bị sụt lún	resolved
\.


--
-- TOC entry 5955 (class 0 OID 37226)
-- Dependencies: 226
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, "applicationId", "docType", "fileName", "fileUrl", "filePath", "mimeType", "fileSize", "isSupplement", "aiStatus", "createdAt", "updatedAt") FROM stdin;
906d1c9b-20ae-4790-9dde-32b18974ebff	e508e868-2681-496f-9969-c6dd22c1f963	Tài liệu bắt buộc	xin xÃÂ¡c nhÃ¡Âº_n cÃÂ° trÃÂº.jpg	/uploads/1776147780013-479399965.jpg	uploads\\1776147780013-479399965.jpg	image/jpeg	677	f	\N	2026-04-14 13:23:00.038+07	2026-04-14 13:23:00.038+07
d0845632-89e4-4af4-8887-f331e504a848	e508e868-2681-496f-9969-c6dd22c1f963	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776147780054-96062566.png	uploads\\1776147780054-96062566.png	image/png	677	f	\N	2026-04-14 13:23:00.058+07	2026-04-14 13:23:00.058+07
6d5b9b24-58f0-4d7a-b08e-c768ff0d3b69	544cf189-664b-45ab-9d03-cf575ec5da5d	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776148584989-331391443.png	uploads\\1776148584989-331391443.png	image/png	677	f	\N	2026-04-14 13:36:25.003+07	2026-04-14 13:36:25.003+07
84845d08-f1eb-4945-a4be-14d53a1ef49e	544cf189-664b-45ab-9d03-cf575ec5da5d	Tài liệu bắt buộc	xin xÃÂ¡c nhÃ¡Âº_n cÃÂ° trÃÂº.jpg	/uploads/1776148585018-584721854.jpg	uploads\\1776148585018-584721854.jpg	image/jpeg	677	f	\N	2026-04-14 13:36:25.024+07	2026-04-14 13:36:25.024+07
144f1b51-3b81-4cdb-bdbc-630d39fb5199	5b12c364-42a1-4596-927d-60ec9baf5e21	Tài liệu bắt buộc	don-xin-bhtn.png	/uploads/1776827029206-512518373.png	uploads\\1776827029206-512518373.png	image/png	3317756	f	\N	2026-04-22 10:03:49.245+07	2026-04-22 10:03:49.245+07
405d1970-b100-453e-8ad5-8440c7779bdb	5b12c364-42a1-4596-927d-60ec9baf5e21	Tài liệu bắt buộc	CCCD front.jpg	/uploads/1776827029255-840958072.jpg	uploads\\1776827029255-840958072.jpg	image/jpeg	1133306	f	\N	2026-04-22 10:03:49.274+07	2026-04-22 10:03:49.274+07
f43a109a-d786-4a46-9680-68214485b89c	e011db3b-64b5-4cc7-9885-aa66ffaa4197	Giấy chứng sinh	don-xin-bhtn.png	/uploads/1776828678503-734291455.png	uploads\\1776828678503-734291455.png	image/png	3317756	f	\N	2026-04-22 10:31:18.531+07	2026-04-22 10:31:18.531+07
ac649465-8ecd-4a23-92f2-fae7d1346076	e011db3b-64b5-4cc7-9885-aa66ffaa4197	CMND/CCCD cha mẹ	xin xÃ¡c nháº­n cÆ° trÃº.jpg	/uploads/1776828678538-626360444.jpg	uploads\\1776828678538-626360444.jpg	image/jpeg	70091	f	\N	2026-04-22 10:31:18.543+07	2026-04-22 10:31:18.543+07
bfc7564b-d62b-4fa2-ab0b-ca378ae0c53b	e011db3b-64b5-4cc7-9885-aa66ffaa4197	Giấy đăng ký kết hôn	CCCD Back.jpg	/uploads/1776828678553-930925007.jpg	uploads\\1776828678553-930925007.jpg	image/jpeg	1355301	f	\N	2026-04-22 10:31:18.564+07	2026-04-22 10:31:18.564+07
dc11c4ac-4372-4833-9098-bad9be0006df	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	Bản gốc cần chứng thực	CCCD Front.jpg	/uploads/1777864620921-707740596.jpg	uploads\\1777864620921-707740596.jpg	image/jpeg	1420794	f	\N	2026-05-04 10:17:00.94+07	2026-05-04 10:17:00.94+07
325286f7-8ec0-4110-b475-97fc0b5761db	adc2e54e-a2a2-44b9-8bf3-d8a69852ec5d	CMND/CCCD người yêu cầu	Sá» há» kháº©u.jpg	/uploads/1777864620954-244080189.jpg	uploads\\1777864620954-244080189.jpg	image/jpeg	85685	f	\N	2026-05-04 10:17:00.959+07	2026-05-04 10:17:00.959+07
2bd499ec-1d5b-4057-be66-39aed38b4aaa	8bc481da-abd4-4302-b3ac-fee6466e05d6	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778420382075-101219984.jpg	uploads\\1778420382075-101219984.jpg	image/jpeg	1420794	f	\N	2026-05-10 20:39:42.084+07	2026-05-10 20:39:42.084+07
be11172d-332d-441a-9b45-ea0bb6f8627f	8bc481da-abd4-4302-b3ac-fee6466e05d6	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778420382091-215483116.jpg	uploads\\1778420382091-215483116.jpg	image/jpeg	1355301	f	\N	2026-05-10 20:39:42.097+07	2026-05-10 20:39:42.097+07
e4f2d6fb-5a68-4f90-aac4-9c38c0d17998	8bc481da-abd4-4302-b3ac-fee6466e05d6	SỔ hộ khẩu.jpg	Sá» há» kháº©u.jpg	/uploads/1778420382103-329134402.jpg	uploads\\1778420382103-329134402.jpg	image/jpeg	85685	f	\N	2026-05-10 20:39:42.106+07	2026-05-10 20:39:42.106+07
a108546b-9ac3-4490-aff5-82eb9c6b8949	0efd3e1c-f467-4d31-8326-3ade00167f12	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778466745269-56828446.jpg	uploads\\1778466745269-56828446.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:32:25.289+07	2026-05-11 09:32:25.289+07
14fedc39-0d49-496c-b6f5-d8bc99bd77f2	0efd3e1c-f467-4d31-8326-3ade00167f12	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778466745300-506587513.jpg	uploads\\1778466745300-506587513.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:32:25.319+07	2026-05-11 09:32:25.319+07
05494b2d-c1bd-405b-be69-46e8a5afd74a	0efd3e1c-f467-4d31-8326-3ade00167f12	Sổ hộ khẩu (1).jpg	Sá» há» kháº©u (1).jpg	/uploads/1778466745331-296769711.jpg	uploads\\1778466745331-296769711.jpg	image/jpeg	132544	f	\N	2026-05-11 09:32:25.337+07	2026-05-11 09:32:25.337+07
65819a98-981f-4f25-9c4b-57031cd7dae5	0efd3e1c-f467-4d31-8326-3ade00167f12	Sổ hộ khẩu (2).jpg	Sá» há» kháº©u (2).jpg	/uploads/1778466745346-266899890.jpg	uploads\\1778466745346-266899890.jpg	image/jpeg	56792	f	\N	2026-05-11 09:32:25.351+07	2026-05-11 09:32:25.351+07
0db1fc8c-2867-4ec4-ba50-cbd1a3a6f9f1	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467017908-56821228.jpg	uploads\\1778467017908-56821228.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:36:57.929+07	2026-05-11 09:36:57.929+07
320136af-365d-488e-90e8-6d26e627dc86	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467017944-345803508.jpg	uploads\\1778467017944-345803508.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:36:57.96+07	2026-05-11 09:36:57.96+07
2288af01-d1f1-4aa7-8771-521bd32ddecd	4141e28a-9ecb-4fe3-a7b4-d1daaa905ef4	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778467017970-755303930.png	uploads\\1778467017970-755303930.png	image/png	3317756	f	\N	2026-05-11 09:36:58.002+07	2026-05-11 09:36:58.002+07
b2f082d3-17d7-477c-b593-03c78300a8f8	b82a90a7-f864-426b-b6a7-f064104d9443	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778467577468-572046887.png	uploads\\1778467577468-572046887.png	image/png	3317756	f	\N	2026-05-11 09:46:17.493+07	2026-05-11 09:46:17.493+07
9095bb4c-5eda-42a6-ab64-0b5ca219a14b	b82a90a7-f864-426b-b6a7-f064104d9443	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467577509-361637444.jpg	uploads\\1778467577509-361637444.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:46:17.529+07	2026-05-11 09:46:17.529+07
6ee0ebab-d140-4a97-b662-122cb1805810	b82a90a7-f864-426b-b6a7-f064104d9443	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467577540-335250808.jpg	uploads\\1778467577540-335250808.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:46:17.556+07	2026-05-11 09:46:17.556+07
c60114bc-e36a-4817-a322-b2ca92fdec10	49b2d779-0f1a-41c7-bf50-c66bc0ded437	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778467672713-157635834.jpg	uploads\\1778467672713-157635834.jpg	image/jpeg	1355301	f	\N	2026-05-11 09:47:52.734+07	2026-05-11 09:47:52.734+07
21a98a9a-29c5-4bf7-9ca1-b88d86020a9f	49b2d779-0f1a-41c7-bf50-c66bc0ded437	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778467672749-633400591.jpg	uploads\\1778467672749-633400591.jpg	image/jpeg	1420794	f	\N	2026-05-11 09:47:52.768+07	2026-05-11 09:47:52.768+07
f6f42476-7b4b-458f-87e7-e35106b924a3	49b2d779-0f1a-41c7-bf50-c66bc0ded437	Sổ hộ khẩu (1).jpg	Sá» há» kháº©u (1).jpg	/uploads/1778467672781-929121662.jpg	uploads\\1778467672781-929121662.jpg	image/jpeg	132544	f	\N	2026-05-11 09:47:52.786+07	2026-05-11 09:47:52.786+07
8ab5132c-741a-45d7-977f-8ba7059e21a6	49b2d779-0f1a-41c7-bf50-c66bc0ded437	Sổ hộ khẩu (2).jpg	Sá» há» kháº©u (2).jpg	/uploads/1778467672798-28918658.jpg	uploads\\1778467672798-28918658.jpg	image/jpeg	56792	f	\N	2026-05-11 09:47:52.802+07	2026-05-11 09:47:52.802+07
63857cdd-3aff-472f-9252-9dd8b7290826	b2aa413e-f832-4b46-9716-92f2c4b89057	don-xin-bhtn.png	don-xin-bhtn.png	/uploads/1778468072785-691602084.png	uploads\\1778468072785-691602084.png	image/png	3317756	f	\N	2026-05-11 09:54:32.814+07	2026-05-11 09:54:32.814+07
3de317a1-259e-4c65-a06b-e4edf3c2894a	9601d723-4af3-4f2d-a4db-14f0e73e4fb6	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778818386093-931175565.jpg	uploads\\1778818386093-931175565.jpg	image/jpeg	774005	f	\N	2026-05-15 11:13:06.104+07	2026-05-15 11:13:06.104+07
8bb4f02f-b693-4d06-a2b9-d9f9d06c2eeb	9601d723-4af3-4f2d-a4db-14f0e73e4fb6	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778818386114-855727766.jpg	uploads\\1778818386114-855727766.jpg	image/jpeg	1355301	f	\N	2026-05-15 11:13:06.127+07	2026-05-15 11:13:06.127+07
87105eb0-f077-419b-9a7e-c95cdf7dec2c	9601d723-4af3-4f2d-a4db-14f0e73e4fb6	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778818386137-180926097.jpg	uploads\\1778818386137-180926097.jpg	image/jpeg	1420794	f	\N	2026-05-15 11:13:06.149+07	2026-05-15 11:13:06.149+07
f2a0f961-9fed-46ae-83f1-3cba16a6e2b5	d6b0e820-5537-4206-9b96-3ee7ee5e5160	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778819327709-883260351.jpg	uploads\\1778819327709-883260351.jpg	image/jpeg	1355301	f	\N	2026-05-15 11:28:47.73+07	2026-05-15 11:28:47.73+07
4de911c0-3e91-4a75-8827-3259cd18654d	d6b0e820-5537-4206-9b96-3ee7ee5e5160	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778819327747-806112828.jpg	uploads\\1778819327747-806112828.jpg	image/jpeg	1420794	f	\N	2026-05-15 11:28:47.806+07	2026-05-15 11:28:47.806+07
06c5d660-cf55-4b1c-ae98-e17f2f2c831e	d6b0e820-5537-4206-9b96-3ee7ee5e5160	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778819327819-262865714.jpg	uploads\\1778819327819-262865714.jpg	image/jpeg	774005	f	\N	2026-05-15 11:28:47.827+07	2026-05-15 11:28:47.827+07
d5992fba-a210-4e84-83aa-8fdccf8c0082	6814a8dd-711c-45bd-beaa-7c6336163589	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778819908730-174952605.jpg	uploads\\1778819908730-174952605.jpg	image/jpeg	774005	f	\N	2026-05-15 11:38:28.743+07	2026-05-15 11:38:28.743+07
cad9172e-4e42-476d-af94-856c01a2de57	6814a8dd-711c-45bd-beaa-7c6336163589	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778819908753-750451097.jpg	uploads\\1778819908753-750451097.jpg	image/jpeg	1355301	f	\N	2026-05-15 11:38:28.766+07	2026-05-15 11:38:28.766+07
15f4506f-8afd-4335-aa11-8a8324829601	6814a8dd-711c-45bd-beaa-7c6336163589	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778819908773-711638374.jpg	uploads\\1778819908773-711638374.jpg	image/jpeg	1420794	f	\N	2026-05-15 11:38:28.782+07	2026-05-15 11:38:28.782+07
cdbc3cea-967f-44ac-8ce6-cd3541bffaa0	2b139c7f-6664-41b1-935f-62dbf567a115	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778820312443-797451287.jpg	uploads\\1778820312443-797451287.jpg	image/jpeg	1355301	f	\N	2026-05-15 11:45:12.47+07	2026-05-15 11:45:12.47+07
fcf24eab-c9ad-4c71-8934-70525acfe8b4	2b139c7f-6664-41b1-935f-62dbf567a115	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778820312497-451935544.jpg	uploads\\1778820312497-451935544.jpg	image/jpeg	1420794	f	\N	2026-05-15 11:45:12.523+07	2026-05-15 11:45:12.523+07
7fe103d7-1d72-419e-abae-62d539b1b39c	2b139c7f-6664-41b1-935f-62dbf567a115	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778820312538-948012746.jpg	uploads\\1778820312538-948012746.jpg	image/jpeg	774005	f	\N	2026-05-15 11:45:12.554+07	2026-05-15 11:45:12.554+07
6c340ff9-9ad6-401e-baf8-4a74aaecbef5	4c98c43a-96ae-434f-a155-a4686eaabc85	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778898262724-8779419.jpg	uploads\\1778898262724-8779419.jpg	image/jpeg	1355301	f	\N	2026-05-16 09:24:22.747+07	2026-05-16 09:24:22.747+07
211e35df-94be-48c6-9ab7-5b07d4f2d21f	4c98c43a-96ae-434f-a155-a4686eaabc85	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778898262776-296310414.jpg	uploads\\1778898262776-296310414.jpg	image/jpeg	1420794	f	\N	2026-05-16 09:24:22.796+07	2026-05-16 09:24:22.796+07
eb24b3e6-104f-4c98-a5e2-4fe7b5db63bf	4c98c43a-96ae-434f-a155-a4686eaabc85	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778898262808-955823390.jpg	uploads\\1778898262808-955823390.jpg	image/jpeg	774005	f	\N	2026-05-16 09:24:22.818+07	2026-05-16 09:24:22.818+07
6cdb7d1b-7c27-4e66-88a7-f35a2ee4a996	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1778900444008-502021033.jpg	uploads\\1778900444008-502021033.jpg	image/jpeg	774005	f	\N	2026-05-16 10:00:44.014+07	2026-05-16 10:00:44.014+07
12b80e2d-b83e-4623-b45f-9633bee92687	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	CCCD Back.jpg	CCCD Back.jpg	/uploads/1778900444029-351996199.jpg	uploads\\1778900444029-351996199.jpg	image/jpeg	1355301	f	\N	2026-05-16 10:00:44.036+07	2026-05-16 10:00:44.036+07
1626233c-ee6c-49bb-b835-e8172e378f01	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	CCCD Front.jpg	CCCD Front.jpg	/uploads/1778900444041-375369397.jpg	uploads\\1778900444041-375369397.jpg	image/jpeg	1420794	f	\N	2026-05-16 10:00:44.047+07	2026-05-16 10:00:44.047+07
6b9e2327-150f-433c-8722-9a8dcec84d30	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779033556470-891269869.jpg	uploads\\1779033556470-891269869.jpg	image/jpeg	1355301	f	\N	2026-05-17 22:59:16.48+07	2026-05-17 22:59:16.48+07
4e54325a-f085-4d2b-a3f9-da983cde0f1e	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779033556500-436272056.jpg	uploads\\1779033556500-436272056.jpg	image/jpeg	1420794	f	\N	2026-05-17 22:59:16.512+07	2026-05-17 22:59:16.512+07
3d82bada-7711-4a3b-8e68-ad0c01cb9114	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1779033556519-605087408.jpg	uploads\\1779033556519-605087408.jpg	image/jpeg	774005	f	\N	2026-05-17 22:59:16.525+07	2026-05-17 22:59:16.525+07
df06848e-1617-4e14-9419-19a403433d58	71aabd81-735b-4f96-8aaa-aada37377855	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779074777211-326411875.jpg	uploads\\1779074777211-326411875.jpg	image/jpeg	1355301	f	\N	2026-05-18 10:26:17.219+07	2026-05-18 10:26:17.219+07
97c7344d-9657-469a-8d1c-9fabd66b02c4	71aabd81-735b-4f96-8aaa-aada37377855	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779074777233-495851927.jpg	uploads\\1779074777233-495851927.jpg	image/jpeg	1420794	f	\N	2026-05-18 10:26:17.24+07	2026-05-18 10:26:17.24+07
7a2a6710-ed6d-401d-a10d-581058b96e06	71aabd81-735b-4f96-8aaa-aada37377855	Tờ Khai XNTTHN.jpg	Tá» Khai XNTTHN.jpg	/uploads/1779074777245-243546852.jpg	uploads\\1779074777245-243546852.jpg	image/jpeg	774005	f	\N	2026-05-18 10:26:17.249+07	2026-05-18 10:26:17.249+07
ab8dc0aa-561e-435c-9271-b4d4de0e3c4b	e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	Đơn Đề Nghị Cấp Phép (Mẫu Đã Điền).pdf	ÄÆ¡n Äá» Nghá» Cáº¥p PhÃ©p (Máº«u ÄÃ£ Äiá»n).pdf	/uploads/1779080089421-564407145.pdf	uploads\\1779080089421-564407145.pdf	application/pdf	103936	f	\N	2026-05-18 11:54:49.425+07	2026-05-18 11:54:49.425+07
35ab9e23-2814-4cdd-9645-21fa59ed9730	e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	Nội Dung Chương Trình Hoạt Động Cấp Phép.pdf	Ná»i Dung ChÆ°Æ¡ng TrÃ¬nh Hoáº¡t Äá»ng Cáº¥p PhÃ©p.pdf	/uploads/1779080089438-504238730.pdf	uploads\\1779080089438-504238730.pdf	application/pdf	79319	f	\N	2026-05-18 11:54:49.441+07	2026-05-18 11:54:49.441+07
7d9d5161-4c34-4c9d-9850-30731d61b880	2c582378-7d7d-432e-9aef-50725604209f	Đơn Đề Nghị Cấp Phép (Mẫu Đã Điền).pdf	ÄÆ¡n Äá» Nghá» Cáº¥p PhÃ©p (Máº«u ÄÃ£ Äiá»n).pdf	/uploads/1779080577213-391373800.pdf	uploads\\1779080577213-391373800.pdf	application/pdf	103936	f	\N	2026-05-18 12:02:57.219+07	2026-05-18 12:02:57.219+07
f8653fda-6604-432d-93c5-e510270a87a8	2c582378-7d7d-432e-9aef-50725604209f	Nội Dung Chương Trình Hoạt Động Cấp Phép.pdf	Ná»i Dung ChÆ°Æ¡ng TrÃ¬nh Hoáº¡t Äá»ng Cáº¥p PhÃ©p.pdf	/uploads/1779080577230-533802588.pdf	uploads\\1779080577230-533802588.pdf	application/pdf	79319	f	\N	2026-05-18 12:02:57.233+07	2026-05-18 12:02:57.233+07
04050158-2af1-4fa8-b617-2ba549ee0da7	9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	Đơn Đề Nghị Cấp Phép (Mẫu Đã Điền).pdf	ÄÆ¡n Äá» Nghá» Cáº¥p PhÃ©p (Máº«u ÄÃ£ Äiá»n).pdf	/uploads/1779157354891-122686500.pdf	uploads\\1779157354891-122686500.pdf	application/pdf	103936	f	\N	2026-05-19 09:22:34.895+07	2026-05-19 09:22:34.895+07
9cb4fc99-58fe-42c6-97b6-67937132ce56	9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	Nội Dung Chương Trình Hoạt Động Cấp Phép.pdf	Ná»i Dung ChÆ°Æ¡ng TrÃ¬nh Hoáº¡t Äá»ng Cáº¥p PhÃ©p.pdf	/uploads/1779157354912-62340234.pdf	uploads\\1779157354912-62340234.pdf	application/pdf	79319	f	\N	2026-05-19 09:22:34.915+07	2026-05-19 09:22:34.915+07
f1fac16e-d567-4bcf-ae67-49ac34384ef3	63c41e18-f075-4054-aa6c-d78a23e96dba	Giấy Tờ Chứng Thực Mẫu - Giấy Xác Nhận Sinh Viên.pdf	Giấy Tờ Chứng Thực Mẫu - Giấy Xác Nhận Sinh Viên.pdf	/uploads/1779162113486-922337723.pdf	uploads\\1779162113486-922337723.pdf	application/pdf	104165	f	\N	2026-05-19 10:41:53.495+07	2026-05-19 10:41:53.495+07
51502a0e-8b9f-44bf-92de-a32f18eb57de	63c41e18-f075-4054-aa6c-d78a23e96dba	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779162113523-709642267.jpg	uploads\\1779162113523-709642267.jpg	image/jpeg	1355301	f	\N	2026-05-19 10:41:53.545+07	2026-05-19 10:41:53.545+07
7cdec34d-77d5-4bce-a959-39f5f65e7652	63c41e18-f075-4054-aa6c-d78a23e96dba	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779162113561-907943451.jpg	uploads\\1779162113561-907943451.jpg	image/jpeg	1420794	f	\N	2026-05-19 10:41:53.576+07	2026-05-19 10:41:53.576+07
38a138ce-548b-49da-9bf6-90e1b578348f	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	Dữ Liệu Mẫu - Giấy Báo Tử.pdf	Dữ Liệu Mẫu - Giấy Báo Tử.pdf	/uploads/1779162406467-320202916.pdf	uploads\\1779162406467-320202916.pdf	application/pdf	82766	f	\N	2026-05-19 10:46:46.47+07	2026-05-19 10:46:46.47+07
68506a42-fd62-4abd-8643-5ea1ace7a947	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	Hồ Sơ Mẫu - Thủ Tục Khai Tử.pdf	Hồ Sơ Mẫu - Thủ Tục Khai Tử.pdf	/uploads/1779162406477-634371752.pdf	uploads\\1779162406477-634371752.pdf	application/pdf	91443	f	\N	2026-05-19 10:46:46.479+07	2026-05-19 10:46:46.479+07
f2cc0764-a2c6-4378-a48c-5d1dcd3ab994	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779162406485-902547250.jpg	uploads\\1779162406485-902547250.jpg	image/jpeg	1355301	f	\N	2026-05-19 10:46:46.491+07	2026-05-19 10:46:46.491+07
3ce2e266-b290-404e-8788-23c1f6019378	e6ffbb83-0128-4b67-a6dc-dfbe43c3ec14	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779162406497-26954921.jpg	uploads\\1779162406497-26954921.jpg	image/jpeg	1420794	f	\N	2026-05-19 10:46:46.502+07	2026-05-19 10:46:46.502+07
953d9257-ee32-4714-9e25-3e35c6678b41	836cbd22-71f4-47a3-93fe-cc338af690cc	Dữ Liệu Mẫu - Giấy Báo Tử.pdf	Dữ Liệu Mẫu - Giấy Báo Tử.pdf	/uploads/1779698334128-608554444.pdf	uploads\\1779698334128-608554444.pdf	application/pdf	82766	f	\N	2026-05-25 15:38:54.137+07	2026-05-25 15:38:54.137+07
84928da0-cdbd-40f6-bf8a-cecab76bb9ce	836cbd22-71f4-47a3-93fe-cc338af690cc	Mặt sau DKKT.jpg	Mặt sau DKKT.jpg	/uploads/1779698334161-356292008.jpg	uploads\\1779698334161-356292008.jpg	image/jpeg	482711	f	\N	2026-05-25 15:38:54.171+07	2026-05-25 15:38:54.171+07
08dfb389-4b2f-490d-b193-01cb7259a153	836cbd22-71f4-47a3-93fe-cc338af690cc	Tờ đơn ĐKKT.jpg	Tờ đơn ĐKKT.jpg	/uploads/1779698334184-898602265.jpg	uploads\\1779698334184-898602265.jpg	image/jpeg	711703	f	\N	2026-05-25 15:38:54.195+07	2026-05-25 15:38:54.195+07
27c781c2-3f8d-446f-a2a6-3236a74fe6fb	836cbd22-71f4-47a3-93fe-cc338af690cc	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779698334205-61210835.jpg	uploads\\1779698334205-61210835.jpg	image/jpeg	1355301	f	\N	2026-05-25 15:38:54.216+07	2026-05-25 15:38:54.216+07
e5cbbf7c-d950-4dc6-9980-e9205c825a84	836cbd22-71f4-47a3-93fe-cc338af690cc	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779698334226-179553123.jpg	uploads\\1779698334226-179553123.jpg	image/jpeg	1420794	f	\N	2026-05-25 15:38:54.239+07	2026-05-25 15:38:54.239+07
6c824c2f-bdb2-4f28-bc2b-efe594cc34bf	8843a47e-36e1-469b-a04b-33656b1aff82	CCCD Back.jpg	CCCD Back.jpg	/uploads/1779698477235-784387579.jpg	uploads\\1779698477235-784387579.jpg	image/jpeg	1355301	f	\N	2026-05-25 15:41:17.25+07	2026-05-25 15:41:17.25+07
b813dd8c-fb41-42af-bfda-a9669ea674ce	8843a47e-36e1-469b-a04b-33656b1aff82	CCCD Front.jpg	CCCD Front.jpg	/uploads/1779698477267-47468532.jpg	uploads\\1779698477267-47468532.jpg	image/jpeg	1420794	f	\N	2026-05-25 15:41:17.279+07	2026-05-25 15:41:17.279+07
2e8a9626-facd-442b-8d53-9cd16f7f917e	8843a47e-36e1-469b-a04b-33656b1aff82	Tờ Khai XNTTHN.jpg	Tờ Khai XNTTHN.jpg	/uploads/1779698477288-47948692.jpg	uploads\\1779698477288-47948692.jpg	image/jpeg	774005	f	\N	2026-05-25 15:41:17.298+07	2026-05-25 15:41:17.298+07
\.


--
-- TOC entry 5963 (class 0 OID 85663)
-- Dependencies: 234
-- Data for Name: form_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_templates (id, "serviceId", "documentName", "fileName", "fileUrl", "extractedFields", "createdAt", "updatedAt") FROM stdin;
30789d45-1551-40ff-b0ff-db418f9e6fb9	e0a41035-c7f1-4f07-a266-d3a1d318a3eb	Tờ khai đăng ký khai sinh	ToKhaiDangKyKhaiSinh.docx	/api/v1/files/1778805743807-592935111-ToKhaiDangKyKhaiSinh.docx	[]	2026-05-15 07:42:24.458+07	2026-05-15 07:42:24.458+07
1eacf61f-0add-4a22-9056-f2ec51ae0bf2	b1965925-499b-4c48-9d8e-ec74ab9679e9	Tờ khai đăng ký kết hôn	ToKhaiDangKyKetHon.docx	/api/v1/files/1778805744464-449822743-ToKhaiDangKyKetHon.docx	[]	2026-05-15 07:42:24.591+07	2026-05-15 07:42:24.591+07
4e83b679-c16f-400d-a858-231b40e85655	ad05eecc-aecb-42b4-913b-e2d40de887ab	Tờ khai đăng ký khai tử	ToKhaiDangKyKhaiTu.docx	/api/v1/files/1778805744595-641745836-ToKhaiDangKyKhaiTu.docx	[]	2026-05-15 07:42:24.757+07	2026-05-15 07:42:24.757+07
b7480a1f-de45-482f-a83a-34a40ff31a72	e0a41035-c7f1-4f07-a266-d3a1d318a3eb	Tờ khai đăng ký khai sinh	ToKhaiDangKyKhaiSinh.docx	/api/v1/files/1778805770314-371406288-ToKhaiDangKyKhaiSinh.docx	["Họ, chữ đệm, tên người yêu cầu", "Nơi cư trú", "Giấy tờ tùy thân", "Quan hệ với người được khai sinh", "Họ, chữ đệm, tên người được khai sinh", "Giới tính", "Ngày, tháng, năm sinh", "Nơi sinh", "Quê quán", "Dân tộc", "Quốc tịch", "Họ, chữ đệm, tên người mẹ", "Họ, chữ đệm, tên người cha"]	2026-05-15 07:42:50.977+07	2026-05-15 07:42:50.977+07
d18335cb-2412-4793-9833-0f6f6e9b107d	b1965925-499b-4c48-9d8e-ec74ab9679e9	Tờ khai đăng ký kết hôn	ToKhaiDangKyKetHon.docx	/api/v1/files/1778805770981-195737569-ToKhaiDangKyKetHon.docx	["Họ, chữ đệm, tên", "Ngày, tháng, năm sinh", "Dân tộc", "Quốc tịch", "Nơi cư trú", "Giấy tờ tùy thân", "Lần kết hôn thứ"]	2026-05-15 07:42:51.082+07	2026-05-15 07:42:51.082+07
146e6c42-1268-4291-ab47-feb36757da07	ad05eecc-aecb-42b4-913b-e2d40de887ab	Tờ khai đăng ký khai tử	ToKhaiDangKyKhaiTu.docx	/api/v1/files/1778805771086-916818444-ToKhaiDangKyKhaiTu.docx	["Họ, chữ đệm, tên người yêu cầu", "Nơi cư trú", "Quan hệ với người chết", "Họ, chữ đệm, tên người chết", "Ngày, tháng, năm sinh", "Ngày, tháng, năm chết", "Nơi chết", "Nguyên nhân chết"]	2026-05-15 07:42:51.207+07	2026-05-15 07:42:51.207+07
\.


--
-- TOC entry 5956 (class 0 OID 37245)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", "applicationId", type, title, message, "isRead", "emailSentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5962 (class 0 OID 44463)
-- Dependencies: 233
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "receiptCode", "applicationId", "userId", "feeType", amount, "paymentMethod", status, "paidAt", note, "createdAt", "updatedAt") FROM stdin;
242cccf3-9a51-4c90-bc39-5975e3b8c4f5	PAY20260515-61516	2b139c7f-6664-41b1-935f-62dbf567a115	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	success	2026-05-15 11:45:33.249+07	\N	2026-05-15 11:45:12.6+07	2026-05-15 11:45:33.249+07
5a13fbd7-0a84-45b6-8018-3817588a8856	PAY20260516-45434	4c98c43a-96ae-434f-a155-a4686eaabc85	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	success	2026-05-16 09:24:47.408+07	\N	2026-05-16 09:24:22.866+07	2026-05-16 09:24:47.408+07
29393d7f-1334-4445-ba9f-fc3090c7d6cc	PAY20260517-68616	5b2daf86-1f1d-41b6-a381-d38ed6cb8a14	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	success	2026-05-17 23:01:27.485+07	\N	2026-05-17 22:59:16.559+07	2026-05-17 23:01:27.485+07
20d6e4ad-15a7-4042-af4a-1347fb8dfbf8	PAY20260516-88508	7e9110d5-b0eb-4f15-b5bc-abfd359cfa4c	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	success	2026-05-18 10:14:40.065+07	\N	2026-05-16 10:00:44.066+07	2026-05-18 10:14:40.066+07
6c1afb9e-2962-48a4-a5e5-f24de27a1d26	PAY20260518-29262	71aabd81-735b-4f96-8aaa-aada37377855	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	success	2026-05-18 10:26:34.64+07	\N	2026-05-18 10:26:17.267+07	2026-05-18 10:26:34.64+07
721ff83f-676e-4e07-8ef0-5d67cbc667c9	PAY20260518-24093	e5ef30d5-fad7-41fc-8dc2-38a8c8de092a	2688bdb5-bf12-447d-98da-de41be9af9c2	Giấy phép hoạt động văn hóa cộng đồng	50000	card	success	2026-05-18 11:54:59.056+07	\N	2026-05-18 11:54:49.463+07	2026-05-18 11:54:59.056+07
eaad0307-ec65-4513-bd78-5f3a2a9a5957	PAY20260519-32178	9e31cba2-f3d9-4eea-85e3-c62ca2f54dc4	2688bdb5-bf12-447d-98da-de41be9af9c2	Giấy phép hoạt động văn hóa cộng đồng	50000	card	success	2026-05-19 09:22:43.019+07	\N	2026-05-19 09:22:34.938+07	2026-05-19 09:22:43.019+07
6ce220c3-c3a6-4188-8908-bab2d0483456	PAY20260519-12645	63c41e18-f075-4054-aa6c-d78a23e96dba	2688bdb5-bf12-447d-98da-de41be9af9c2	Chứng thực bản sao	5000	card	success	2026-05-19 10:42:07.199+07	\N	2026-05-19 10:41:53.627+07	2026-05-19 10:42:07.199+07
ba00e8d6-ab87-41c4-8a9f-0e4ead3c496c	PAY20260518-34036	2c582378-7d7d-432e-9aef-50725604209f	2688bdb5-bf12-447d-98da-de41be9af9c2	Giấy phép hoạt động văn hóa cộng đồng	50000	card	success	2026-05-25 15:21:10.597+07	\N	2026-05-18 12:02:57.277+07	2026-05-25 15:21:10.598+07
cd0cdf35-60eb-4024-bc13-e225a9493d01	PAY20260525-56625	8843a47e-36e1-469b-a04b-33656b1aff82	2688bdb5-bf12-447d-98da-de41be9af9c2	Xác nhận tình trạng hôn nhân	15000	card	pending	\N	\N	2026-05-25 15:41:17.337+07	2026-05-25 15:41:17.337+07
\.


--
-- TOC entry 5961 (class 0 OID 37357)
-- Dependencies: 232
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, excerpt, content, "imageUrl", category, "isPublished", "publishedAt", "authorId", "createdAt", "updatedAt") FROM stdin;
72cdeffa-e2ee-4198-8301-a03d7cd5b504	Triển khai hệ thống định danh điện tử quốc gia VNeID 2.0	Chính phủ chính thức ra mắt phiên bản nâng cấp của ứng dụng định danh điện tử với nhiều tính năng mới...	Ứng dụng VNeID 2.0 tích hợp xác thực sinh trắc học, bảo hiểm y tế điện tử và ký số trực tuyến. Cập nhật ngay trên App Store và Google Play.	https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600	Tin tức	t	2026-03-28 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:47:59.345+07
bcda7438-58e0-4a78-95fe-0e6359223ece	Hướng dẫn đăng ký doanh nghiệp trực tuyến đơn giản, nhanh chóng	Quy trình đăng ký thành lập doanh nghiệp hoàn toàn trực tuyến chỉ trong 3 ngày làm việc...	Truy cập Cổng Dịch vụ Công, điền thông tin, tải hồ sơ và ký số. Không cần đến trực tiếp UBND.	https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600	Hướng dẫn	t	2026-03-25 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:47:59.81+07
42ddda4a-5e19-4780-a924-6b883e744f6b	Nâng cấp hệ thống vào ngày 05/04/2026 từ 22h00 đến 02h00	Hệ thống sẽ tạm thời gián đoạn để nâng cấp và bảo trì, quý khách vui lòng thực hiện giao dịch trước thời gian này...	Cổng DỊCH VỤ CÔNG tạm ngưng từ 22h00 ngày 05/04 đến 02h00 ngày 06/04 để bảo trì.	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600	Thông báo	t	2026-03-22 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:48:00.262+07
407f7ae4-7a18-4086-b834-81fb0ce1e931	Mở rộng danh mục 500 dịch vụ công trực tuyến mức độ 4	Bộ Thông tin và Truyền thông công bố danh sách mở rộng các dịch vụ công trực tuyến toàn trình...	500 dịch vụ công cấp độ 4 toàn trình, không cần bản giấy — bước tiến chuyển đổi số 2025-2030.	https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600	Tin tức	t	2026-03-20 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:48:00.911+07
065da771-50b7-4eaf-99e1-4ce4b9c6f2a8	Cách tra cứu và thanh toán thuế trực tuyến qua Cổng Dịch vụ công	Người dân và doanh nghiệp có thể tra cứu, kê khai và thanh toán thuế hoàn toàn trực tuyến...	Hỗ trợ thanh toán qua thẻ ngân hàng, VNPay, MoMo và chuyển khoản — không cần đến cơ quan thuế.	https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600	Hướng dẫn	t	2026-03-18 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:48:01.377+07
e321db72-f214-4e5b-a262-3563ceaa466f	Tích hợp thanh toán điện tử và chữ ký số vào dịch vụ công	Nền tảng cho phép người dùng thanh toán trực tuyến và ký số ngay trên giao diện dịch vụ công...	Hỗ trợ chữ ký số USB Token, SmartSign, và thanh toán qua VNPay, PayOS, QR Code ngân hàng.	https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600	Tin tức	t	2026-03-15 07:00:00+07	87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	2026-04-14 12:13:12.13+07	2026-05-18 09:48:02.113+07
\.


--
-- TOC entry 5959 (class 0 OID 37307)
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
-- TOC entry 5953 (class 0 OID 37161)
-- Dependencies: 224
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, category, description, agency, "processingTime", "processingDays", level, fee, "requiredDocs", "isActive", "createdAt", "updatedAt", "currentFee", procedures, workflow) FROM stdin;
ad05eecc-aecb-42b4-913b-e2d40de887ab	Đăng ký khai tử	individual	\N	Ủy ban nhân dân cấp xã	2 ngày làm việc	2	Mức độ 4	Miễn phí	[{"name": "Tờ khai đăng ký khai tử", "templateUrl": "/templates/ToKhaiDangKyKhaiTu.docx"}, {"name": "Giấy báo tử"}, {"name": "CMND/CCCD người thân"}]	t	2026-04-14 12:13:12.124+07	2026-05-15 08:22:23.118+07	0	Bước 1: Công dân truy cập hệ thống Dịch vụ công, đăng nhập tài khoản.\nBước 2: Tìm kiếm dịch vụ "Đăng ký khai tử" và điền Tờ khai điện tử.\nBước 3: Tải lên bản chụp/scan Giấy báo tử và giấy tờ nhân thân của người thực hiện.\nBước 4: Nộp hồ sơ. Nhận tin nhắn thông báo mã hồ sơ.\nBước 5: Nhận kết quả bản điện tử (Trích lục khai tử) qua tài khoản Dịch vụ công.	Tiếp nhận hồ sơ trực tuyến -> Xác minh thông tin -> Ghi sổ hộ tịch điện tử -> Trình ký số -> Trả kết quả điện tử.
1fca8e79-3c49-47e9-9421-2db889a53971	Đăng ký tạm vắng	individual	\N	Công an cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "CMND/CCCD", "docType": "cccd", "required": true}, {"label": "Sổ hộ khẩu", "docType": "ho_khau", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:46:30.611+07	0	\N	\N
dc6bae36-43b2-4d9e-b217-81dacec10953	Chứng thực chữ ký	individual	\N	Ủy ban nhân dân cấp xã	Trong ngày	1	Mức độ 4	10.000 VNĐ	[{"label": "Giấy tờ cần chứng thực", "docType": "giay_to_chung_thuc", "required": true}, {"label": "CMND/CCCD", "docType": "cccd", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:47:19.936+07	0	\N	\N
21e8d1aa-acab-4b09-b346-7aa72b64e054	Giấy phép xây dựng nhà ở	individual	\N	Ủy ban nhân dân cấp xã	7 ngày làm việc	7	Mức độ 3	50.000 VNĐ	[{"label": "Đơn xin cấp phép xây dựng", "docType": "don_xin_cap_phep", "required": true}, {"label": "Bản vẽ thiết kế", "docType": "ban_ve_thiet_ke", "required": true}, {"label": "Sổ đỏ / Giấy chứng nhận QSDĐ", "docType": "so_do", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:48:03.196+07	0	\N	\N
9bb9280a-e545-4853-934b-e582b504904b	Đăng ký tạm trú	individual	\N	Công an cấp xã	2 ngày làm việc	2	Mức độ 4	Miễn phí	[{"label": "Mẫu CT01 - Tờ khai thay đổi thông tin cư trú", "docType": "mau_ct01", "required": true}, {"label": "Giấy tờ chứng minh chỗ ở hợp pháp", "docType": "giay_cho_o_hop_phap", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0	\N	\N
bb8025ff-c0f3-475a-bc46-9436db0403ff	Chứng thực bản sao	individual		Ủy ban nhân dân cấp xã	Trong ngày	1	Mức độ 4	5.000 VNĐ/trang	[{"label": "Bản gốc cần chứng thực", "docType": "ban_goc", "required": true}, {"label": "CMND/CCCD người yêu cầu", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:14:10.798+07	0	\N	\N
3a7a0a83-7874-410a-92ee-abab0e1891a1	Thay đổi nội dung hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	2 ngày làm việc	2	Mức độ 3	30.000 VNĐ	[{"label": "Thông báo thay đổi nội dung đăng ký", "docType": "thong_bao_thay_doi", "required": true}, {"label": "CMND/CCCD chủ hộ", "docType": "cccd", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0	\N	\N
3beeff4f-e24d-4f0c-9c57-e74b568f08ec	Giấy phép hoạt động văn hóa cộng đồng	organization	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 3	50.000 VNĐ	[{"label": "Đơn xin cấp phép", "docType": "don_xin_cap_phep", "required": true}, {"label": "Nội dung chương trình hoạt động", "docType": "noi_dung_chuong_trinh", "required": true}]	t	2026-04-14 12:13:12.124+07	2026-04-14 12:13:12.124+07	0	\N	\N
4fa4c5c1-33e5-407e-9578-fa1898e28c20	Đăng ký hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 3	50.000 VNĐ	[{"label": "Mẫu đăng ký hộ kinh doanh", "docType": "mau_dang_ky_hkd", "required": true}, {"label": "CMND/CCCD chủ hộ", "docType": "cccd", "required": true}, {"label": "Giấy tờ về địa điểm kinh doanh", "docType": "giay_to_dia_diem", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:48:36.061+07	0	\N	\N
084ca797-d370-4e03-83f4-9df25efb879c	Tạm ngừng kinh doanh	business	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "Thông báo tạm ngừng kinh doanh", "docType": "thong_bao_tam_ngung", "required": true}, {"label": "Giấy chứng nhận đăng ký hộ kinh doanh", "docType": "giay_cn_hkd", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:53:24.409+07	0	\N	\N
e0a41035-c7f1-4f07-a266-d3a1d318a3eb	Đăng ký khai sinh	individual	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 4	Miễn phí	[{"name": "Tờ khai đăng ký khai sinh", "templateUrl": "/templates/ToKhaiDangKyKhaiSinh.docx"}, {"name": "Giấy chứng sinh"}, {"name": "CMND/CCCD cha mẹ"}, {"name": "Giấy đăng ký kết hôn"}]	t	2026-04-14 12:13:12.124+07	2026-05-15 08:22:23.106+07	15000	Bước 1: Công dân truy cập hệ thống Dịch vụ công, đăng nhập tài khoản.\nBước 2: Tìm kiếm dịch vụ "Đăng ký khai sinh" và điền Tờ khai điện tử.\nBước 3: Tải lên các giấy tờ đính kèm bản số hóa (Giấy chứng sinh, CMND/CCCD, Đăng ký kết hôn).\nBước 4: Xác nhận và nộp hồ sơ.\nBước 5: Nhận kết quả trực tuyến (Bản điện tử Giấy khai sinh) hoặc qua dịch vụ bưu chính.	Tiếp nhận hồ sơ trực tuyến -> Cán bộ kiểm tra số hóa -> Công chức tư pháp ghi sổ hộ tịch điện tử -> Trình ký số -> Cấp Giấy khai sinh điện tử.
0beced60-7756-4e78-ae79-7e737dac3e5e	Chấm dứt hoạt động hộ kinh doanh	business	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"label": "Thông báo chấm dứt hoạt động", "docType": "thong_bao_cham_dut", "required": true}, {"label": "Giấy chứng nhận đăng ký hộ kinh doanh", "docType": "giay_cn_hkd", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:53:24.417+07	0	\N	\N
3fff7f23-d5f0-4aa3-a602-ff921d88d6b8	Đăng ký hoạt động tôn giáo	organization	\N	Ủy ban nhân dân cấp xã	7 ngày làm việc	7	Mức độ 3	Miễn phí	[{"label": "Đơn đăng ký hoạt động tôn giáo", "docType": "don_dang_ky", "required": true}, {"label": "Danh sách người đại diện", "docType": "danh_sach_dd", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:53:24.42+07	0	\N	\N
39bb15e1-e24e-4d80-a869-f85f009a6138	Giấy phép tổ chức lễ hội	organization	\N	Ủy ban nhân dân cấp xã	5 ngày làm việc	5	Mức độ 3	100.000 VNĐ	[{"label": "Đơn xin cấp phép tổ chức lễ hội", "docType": "don_xin_cap_phep", "required": true}, {"label": "Kịch bản chương trình", "docType": "kich_ban", "required": true}, {"label": "Danh sách ban tổ chức", "docType": "danh_sach_btt", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:53:24.422+07	0	\N	\N
abd60163-3583-4e50-a58e-290981379968	Xác nhận hộ nghèo/hộ cận nghèo	organization	\N	Ủy ban nhân dân cấp xã	5 ngày làm việc	5	Mức độ 3	Miễn phí	[{"label": "Đơn đề nghị xác nhận", "docType": "don_de_nghi", "required": true}, {"label": "Sổ hộ khẩu", "docType": "ho_khau", "required": true}, {"label": "CMND/CCCD", "docType": "cccd", "required": true}]	f	2026-04-14 12:13:12.124+07	2026-05-18 10:53:24.423+07	0	\N	\N
b1965925-499b-4c48-9d8e-ec74ab9679e9	Đăng ký kết hôn	individual	\N	Ủy ban nhân dân cấp xã	1 ngày làm việc	1	Mức độ 4	Miễn phí	[{"name": "Tờ khai đăng ký kết hôn", "templateUrl": "/templates/ToKhaiDangKyKetHon.docx"}, {"name": "Giấy xác nhận tình trạng hôn nhân"}, {"name": "CMND/CCCD hai bên"}, {"name": "Sổ hộ khẩu"}]	t	2026-04-14 12:13:12.124+07	2026-05-15 08:22:23.121+07	30000	Bước 1: Công dân đăng nhập hệ thống Dịch vụ công, chọn dịch vụ "Đăng ký kết hôn".\nBước 2: Hoàn thiện Tờ khai điện tử.\nBước 3: Tải lên các tài liệu: Giấy XNTTHN (bản điện tử hoặc bản scan), CMND/CCCD, Sổ hộ khẩu.\nBước 4: Nộp hồ sơ trực tuyến chờ xét duyệt.\nBước 5: Hai bên nam nữ đến UBND cấp xã ký Giấy chứng nhận kết hôn và Sổ hộ tịch (theo lịch hẹn nhận kết quả).	Tiếp nhận hồ sơ điện tử -> Kiểm tra điều kiện trực tuyến -> Xếp lịch hẹn ký xác nhận -> Hai bên có mặt ký tên -> Trả kết quả bản chính.
c9957552-2050-417f-a07a-02633dc33696	Xác nhận tình trạng hôn nhân	individual	\N	Ủy ban nhân dân cấp xã	3 ngày làm việc	3	Mức độ 4	15.000 VNĐ	[{"name": "Tờ khai cấp Giấy xác nhận tình trạng hôn nhân", "templateUrl": "/templates/mau-to-khai-cap-giay-xac-nhan-tinh-trang-hon-nhan.docx"}, {"name": "CMND/CCCD"}]	t	2026-05-15 08:00:29.022+07	2026-05-15 08:22:23.124+07	0	Bước 1: Công dân truy cập Cổng dịch vụ công quốc gia, đăng nhập, tìm kiếm và lựa chọn dịch vụ Xác nhận tình trạng hôn nhân.\nBước 2: Điền đầy đủ thông tin vào Tờ khai điện tử tương tác.\nBước 3: Tải lên các giấy tờ đính kèm theo quy định (Tờ khai, CMND/CCCD, v.v.).\nBước 4: Nộp phí/lệ phí trực tuyến (nếu có).\nBước 5: Hoàn tất nộp hồ sơ. Cán bộ sẽ xử lý và trả kết quả bản điện tử (hoặc bản giấy qua bưu điện/nhận trực tiếp tùy chọn).	Tiếp nhận hồ sơ điện tử -> Xác minh tình trạng hôn nhân -> Trình ký số Giấy xác nhận -> Trả kết quả điện tử/giấy.
\.


--
-- TOC entry 5952 (class 0 OID 37139)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "fullName", cccd, email, password, role, "isVerified", "verifyToken", dob, phone, gender, pob, hometown, address, "taxCode", "insuranceCode", passport, "driverLicense", nationality, "issueDate", "expiryDate", "issuePlace", "officerCode", department, "workPhone", "position", "createdAt", "updatedAt") FROM stdin;
10f58b1c-8bf7-4fa3-97ec-d0eb2dcd7ec6	Nguyễn Huy Hoàng	0638473619	nguyenhuyhoang@gmail.com	$2b$10$KJOTNC400i6K3ZHON2Ab4uOmfZMNqhQ.DRAce1.xS6.S9n2akpwEm	citizen	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-04-14 13:19:38.388+07	2026-04-14 13:21:42.839+07
4197d2bc-3f97-4729-8334-230047d5eaf8	Trần Thị Công Dân	079200012345	citizen@example.com	$2b$10$B/RLOJLSlttDgQTpsaaT1.ZNAKZjz9DSn5sOEXSmMHR5l3wsrJLb2	citizen	t	\N	2000-01-01	0901234567	Nam	Hà Nội	Hà Nội	Số 1 Cầu Giấy, Hà Nội	\N	\N	\N	\N	Việt Nam	2021-05-15	2035-01-01	Cục CS QLHC về TTXH	\N	\N	\N	\N	2026-04-14 12:13:11.961+07	2026-04-19 07:56:42.936+07
488e021b-4359-42aa-b099-50e063bdb740	Võ Quang Khải	079187009012	khai.vo@ubndp11.gov.vn	$2b$10$C4PcQ4sQC6Gte9wICBZeNuAlYK2xknNeRpzmY7wQFKb6XMavXWkhm	officer	t	\N	1987-12-03	0916789012	Nam	Tỉnh Đồng Nai	Ấp 5, Xã Hiệp Hòa, Huyện Long Thành, Tỉnh Đồng Nai	Số 9 Đường Ung Văn Khiêm, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh	\N	\N	\N	\N	Việt Nam	2020-11-20	2030-11-20	Công an TP. Hồ Chí Minh	CB-P11-003	Bộ phận Một cửa — Đăng ký cư trú	028.38.421.003	Chuyên viên quản lý cư trú	2026-05-19 10:56:23.187+07	2026-05-19 10:56:23.187+07
87d99e4b-c5b4-4d4a-84f6-d83dac41a2c4	Nguyễn Văn B	C82024001	nguyenvanb@bennghe.gov.vn	$2b$10$EX/zZhfHAn5aUETUAbUwhuKkLxkBIAu4qhhzyXaawsvY4KC76YFpC	officer	t	78493b69aaa65d4bb3fbe75013023d16bab91a99428cbd242b0cdd82b966f14b	\N	0912345678	\N	\N	\N	UBND Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh	\N	\N	\N	\N	\N	\N	\N	\N	C82024001	UBND Phường Bến Nghé	0781254685	Cán bộ tiếp nhận hồ sơ	2026-04-14 12:13:12.051+07	2026-05-18 10:07:27.97+07
2688bdb5-bf12-447d-98da-de41be9af9c2	TRIEU DOAN KY	094205001245	trieukyst5678@gmail.com	$2b$10$YqWu.QVIKxcfaWDLuhX9y.bSVozIWX6FIEthU5M/qZfUy.zkQ/wda	citizen	t	\N	2005-10-28	\N	Nam	My Xuyen, Can Tho	Ap Thanh Loi, My Xuyen, Can Tho	So 214/38, Tinh Lo 934, Ap Thanh Loi, My Xuyen, Can Tho	\N	\N	\N	\N	Viet Nam	2020-01-30	2030-10-28	BO CONG AN	\N	\N	\N	\N	2026-04-22 10:06:57.469+07	2026-05-19 09:20:33.239+07
fb78a1c4-9d21-4963-abb0-4df297abdc58	Nguyễn Thị Hương	079204012345	huong.nguyen@gmail.com	$2b$10$Xswct4wlTK00fDZhQzb2seogOkdsC92ooUXtzJIC/62Zp3pGI/hZi	citizen	t	\N	1992-03-15	0903456781	Nữ	TP. Hồ Chí Minh	Phường 11, Quận Bình Thạnh, TP. Hồ Chí Minh	Số 34 Đường Bình Lợi, Phường 13, Quận Bình Thạnh, TP. Hồ Chí Minh	8312049123	DN1234567890	\N	\N	Việt Nam	2021-01-20	2031-01-20	Cục Cảnh sát QLHC về TTXH – Bộ Công an	\N	\N	\N	\N	2026-05-19 10:56:22.775+07	2026-05-19 10:56:22.775+07
bb833f50-9fe5-4784-94fc-40df68761341	Trần Văn Minh	079193056789	minh.tran85@yahoo.com	$2b$10$a9WwM.uZuBRBUVRg369Up.aMVK8xHVEX0FOeirGzlwTG0N0sKji9W	citizen	t	\N	1985-07-22	0912345678	Nam	Tỉnh Long An	Ấp 3, Xã Thạnh Hòa, Huyện Bến Lức, Tỉnh Long An	Số 12/5 Đường Phan Văn Trị, Phường 11, Quận Bình Thạnh, TP. Hồ Chí Minh	8129045678	DN0987654321	\N	\N	Việt Nam	2020-05-10	2030-05-10	Cục Cảnh sát QLHC về TTXH – Bộ Công an	\N	\N	\N	\N	2026-05-19 10:56:22.866+07	2026-05-19 10:56:22.866+07
dca472c5-b4d0-4215-b276-b1b7557e0c12	Lê Thị Thanh Tuyền	079200098765	tuyen.le2000@gmail.com	$2b$10$pDLTOfmh0Yu1k618EJ8taO.mowutf4b9vjwbFMmFrfDssU2Q9kHee	citizen	t	\N	2000-11-08	0976543210	Nữ	TP. Cần Thơ	Số 15 Đường Nguyễn Đình Chiểu, Phường An Bình, Quận Ninh Kiều, TP. Cần Thơ	Số 5 Hẻm 120 Đường Xô Viết Nghệ Tĩnh, Phường 21, Quận Bình Thạnh, TP. Hồ Chí Minh	8320067890	DN1122334455	B5234098	\N	Việt Nam	2022-06-15	2032-06-15	Cục Cảnh sát QLHC về TTXH – Bộ Công an	\N	\N	\N	\N	2026-05-19 10:56:22.941+07	2026-05-19 10:56:22.941+07
dd543923-0d3f-46b9-9bc9-334864892b89	Nguyễn Văn Phúc	079178001234	phuc.nguyen@ubndp11.gov.vn	$2b$10$ZwEg7hO8UiNj2XNAQZMkGejsOqYr/ljYwR5RZcx9vGB498xCT14BC	officer	t	\N	1978-04-10	0283456789	Nam	TP. Hồ Chí Minh	Phường 9, Quận Bình Thạnh, TP. Hồ Chí Minh	Số 150 Đường Nơ Trang Long, Phường 14, Quận Bình Thạnh, TP. Hồ Chí Minh	\N	\N	\N	\N	Việt Nam	2018-03-01	2028-03-01	Công an TP. Hồ Chí Minh	CB-P11-001	Bộ phận Một cửa — Hộ tịch	028.38.421.001	Chuyên viên hộ tịch	2026-05-19 10:56:23.016+07	2026-05-19 10:56:23.016+07
fd54e70d-35fe-47bc-8abe-0ccec1a45f78	Phạm Thị Lan Anh	079183005678	lananh.pham@ubndp11.gov.vn	$2b$10$Ae6fXv2pKb0s2H3HLJcedenfjA1qK/oSY20q8zPAR/EHabUjgbRqm	officer	t	\N	1983-09-25	0903567890	Nữ	Tỉnh Bình Dương	Số 22 Đường Nguyễn Trãi, Phường Phú Cường, TP. Thủ Dầu Một, Tỉnh Bình Dương	Số 78 Đường Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh, TP. Hồ Chí Minh	\N	\N	\N	\N	Việt Nam	2019-08-15	2029-08-15	Công an TP. Hồ Chí Minh	CB-P11-002	Bộ phận Một cửa — Tư pháp	028.38.421.002	Chuyên viên tư pháp – chứng thực	2026-05-19 10:56:23.099+07	2026-05-19 10:56:23.099+07
\.


--
-- TOC entry 5646 (class 2606 OID 37306)
-- Name: ai_logs ai_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT ai_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5651 (class 2606 OID 37339)
-- Name: application_histories application_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT application_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 5463 (class 2606 OID 88243)
-- Name: applications applications_applicationCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key" UNIQUE ("applicationCode");


--
-- TOC entry 5465 (class 2606 OID 88175)
-- Name: applications applications_applicationCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key1" UNIQUE ("applicationCode");


--
-- TOC entry 5467 (class 2606 OID 88247)
-- Name: applications applications_applicationCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key10" UNIQUE ("applicationCode");


--
-- TOC entry 5469 (class 2606 OID 88239)
-- Name: applications applications_applicationCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key11" UNIQUE ("applicationCode");


--
-- TOC entry 5471 (class 2606 OID 88249)
-- Name: applications applications_applicationCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key12" UNIQUE ("applicationCode");


--
-- TOC entry 5473 (class 2606 OID 88237)
-- Name: applications applications_applicationCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key13" UNIQUE ("applicationCode");


--
-- TOC entry 5475 (class 2606 OID 88251)
-- Name: applications applications_applicationCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key14" UNIQUE ("applicationCode");


--
-- TOC entry 5477 (class 2606 OID 88253)
-- Name: applications applications_applicationCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key15" UNIQUE ("applicationCode");


--
-- TOC entry 5479 (class 2606 OID 88255)
-- Name: applications applications_applicationCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key16" UNIQUE ("applicationCode");


--
-- TOC entry 5481 (class 2606 OID 88235)
-- Name: applications applications_applicationCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key17" UNIQUE ("applicationCode");


--
-- TOC entry 5483 (class 2606 OID 88257)
-- Name: applications applications_applicationCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key18" UNIQUE ("applicationCode");


--
-- TOC entry 5485 (class 2606 OID 88233)
-- Name: applications applications_applicationCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key19" UNIQUE ("applicationCode");


--
-- TOC entry 5487 (class 2606 OID 88337)
-- Name: applications applications_applicationCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key2" UNIQUE ("applicationCode");


--
-- TOC entry 5489 (class 2606 OID 88259)
-- Name: applications applications_applicationCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key20" UNIQUE ("applicationCode");


--
-- TOC entry 5491 (class 2606 OID 88231)
-- Name: applications applications_applicationCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key21" UNIQUE ("applicationCode");


--
-- TOC entry 5493 (class 2606 OID 88261)
-- Name: applications applications_applicationCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key22" UNIQUE ("applicationCode");


--
-- TOC entry 5495 (class 2606 OID 88229)
-- Name: applications applications_applicationCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key23" UNIQUE ("applicationCode");


--
-- TOC entry 5497 (class 2606 OID 88263)
-- Name: applications applications_applicationCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key24" UNIQUE ("applicationCode");


--
-- TOC entry 5499 (class 2606 OID 88227)
-- Name: applications applications_applicationCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key25" UNIQUE ("applicationCode");


--
-- TOC entry 5501 (class 2606 OID 88265)
-- Name: applications applications_applicationCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key26" UNIQUE ("applicationCode");


--
-- TOC entry 5503 (class 2606 OID 88225)
-- Name: applications applications_applicationCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key27" UNIQUE ("applicationCode");


--
-- TOC entry 5505 (class 2606 OID 88267)
-- Name: applications applications_applicationCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key28" UNIQUE ("applicationCode");


--
-- TOC entry 5507 (class 2606 OID 88269)
-- Name: applications applications_applicationCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key29" UNIQUE ("applicationCode");


--
-- TOC entry 5509 (class 2606 OID 88339)
-- Name: applications applications_applicationCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key3" UNIQUE ("applicationCode");


--
-- TOC entry 5511 (class 2606 OID 88223)
-- Name: applications applications_applicationCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key30" UNIQUE ("applicationCode");


--
-- TOC entry 5513 (class 2606 OID 88271)
-- Name: applications applications_applicationCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key31" UNIQUE ("applicationCode");


--
-- TOC entry 5515 (class 2606 OID 88221)
-- Name: applications applications_applicationCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key32" UNIQUE ("applicationCode");


--
-- TOC entry 5517 (class 2606 OID 88273)
-- Name: applications applications_applicationCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key33" UNIQUE ("applicationCode");


--
-- TOC entry 5519 (class 2606 OID 88219)
-- Name: applications applications_applicationCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key34" UNIQUE ("applicationCode");


--
-- TOC entry 5521 (class 2606 OID 88275)
-- Name: applications applications_applicationCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key35" UNIQUE ("applicationCode");


--
-- TOC entry 5523 (class 2606 OID 88277)
-- Name: applications applications_applicationCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key36" UNIQUE ("applicationCode");


--
-- TOC entry 5525 (class 2606 OID 88217)
-- Name: applications applications_applicationCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key37" UNIQUE ("applicationCode");


--
-- TOC entry 5527 (class 2606 OID 88279)
-- Name: applications applications_applicationCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key38" UNIQUE ("applicationCode");


--
-- TOC entry 5529 (class 2606 OID 88215)
-- Name: applications applications_applicationCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key39" UNIQUE ("applicationCode");


--
-- TOC entry 5531 (class 2606 OID 88281)
-- Name: applications applications_applicationCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key40" UNIQUE ("applicationCode");


--
-- TOC entry 5533 (class 2606 OID 88283)
-- Name: applications applications_applicationCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key41" UNIQUE ("applicationCode");


--
-- TOC entry 5535 (class 2606 OID 88213)
-- Name: applications applications_applicationCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key42" UNIQUE ("applicationCode");


--
-- TOC entry 5537 (class 2606 OID 88285)
-- Name: applications applications_applicationCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key43" UNIQUE ("applicationCode");


--
-- TOC entry 5539 (class 2606 OID 88211)
-- Name: applications applications_applicationCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key44" UNIQUE ("applicationCode");


--
-- TOC entry 5541 (class 2606 OID 88287)
-- Name: applications applications_applicationCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key45" UNIQUE ("applicationCode");


--
-- TOC entry 5543 (class 2606 OID 88209)
-- Name: applications applications_applicationCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key46" UNIQUE ("applicationCode");


--
-- TOC entry 5545 (class 2606 OID 88289)
-- Name: applications applications_applicationCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key47" UNIQUE ("applicationCode");


--
-- TOC entry 5547 (class 2606 OID 88207)
-- Name: applications applications_applicationCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key48" UNIQUE ("applicationCode");


--
-- TOC entry 5549 (class 2606 OID 88291)
-- Name: applications applications_applicationCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key49" UNIQUE ("applicationCode");


--
-- TOC entry 5551 (class 2606 OID 88205)
-- Name: applications applications_applicationCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key50" UNIQUE ("applicationCode");


--
-- TOC entry 5553 (class 2606 OID 88293)
-- Name: applications applications_applicationCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key51" UNIQUE ("applicationCode");


--
-- TOC entry 5555 (class 2606 OID 88203)
-- Name: applications applications_applicationCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key52" UNIQUE ("applicationCode");


--
-- TOC entry 5557 (class 2606 OID 88295)
-- Name: applications applications_applicationCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key53" UNIQUE ("applicationCode");


--
-- TOC entry 5559 (class 2606 OID 88201)
-- Name: applications applications_applicationCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key54" UNIQUE ("applicationCode");


--
-- TOC entry 5561 (class 2606 OID 88297)
-- Name: applications applications_applicationCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key55" UNIQUE ("applicationCode");


--
-- TOC entry 5563 (class 2606 OID 88199)
-- Name: applications applications_applicationCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key56" UNIQUE ("applicationCode");


--
-- TOC entry 5565 (class 2606 OID 88299)
-- Name: applications applications_applicationCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key57" UNIQUE ("applicationCode");


--
-- TOC entry 5567 (class 2606 OID 88197)
-- Name: applications applications_applicationCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key58" UNIQUE ("applicationCode");


--
-- TOC entry 5569 (class 2606 OID 88301)
-- Name: applications applications_applicationCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key59" UNIQUE ("applicationCode");


--
-- TOC entry 5571 (class 2606 OID 88195)
-- Name: applications applications_applicationCode_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key60" UNIQUE ("applicationCode");


--
-- TOC entry 5573 (class 2606 OID 88303)
-- Name: applications applications_applicationCode_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key61" UNIQUE ("applicationCode");


--
-- TOC entry 5575 (class 2606 OID 88193)
-- Name: applications applications_applicationCode_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key62" UNIQUE ("applicationCode");


--
-- TOC entry 5577 (class 2606 OID 88305)
-- Name: applications applications_applicationCode_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key63" UNIQUE ("applicationCode");


--
-- TOC entry 5579 (class 2606 OID 88307)
-- Name: applications applications_applicationCode_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key64" UNIQUE ("applicationCode");


--
-- TOC entry 5581 (class 2606 OID 88191)
-- Name: applications applications_applicationCode_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key65" UNIQUE ("applicationCode");


--
-- TOC entry 5583 (class 2606 OID 88309)
-- Name: applications applications_applicationCode_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key66" UNIQUE ("applicationCode");


--
-- TOC entry 5585 (class 2606 OID 88189)
-- Name: applications applications_applicationCode_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key67" UNIQUE ("applicationCode");


--
-- TOC entry 5587 (class 2606 OID 88311)
-- Name: applications applications_applicationCode_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key68" UNIQUE ("applicationCode");


--
-- TOC entry 5589 (class 2606 OID 88313)
-- Name: applications applications_applicationCode_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key69" UNIQUE ("applicationCode");


--
-- TOC entry 5591 (class 2606 OID 88315)
-- Name: applications applications_applicationCode_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key70" UNIQUE ("applicationCode");


--
-- TOC entry 5593 (class 2606 OID 88187)
-- Name: applications applications_applicationCode_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key71" UNIQUE ("applicationCode");


--
-- TOC entry 5595 (class 2606 OID 88317)
-- Name: applications applications_applicationCode_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key72" UNIQUE ("applicationCode");


--
-- TOC entry 5597 (class 2606 OID 88319)
-- Name: applications applications_applicationCode_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key73" UNIQUE ("applicationCode");


--
-- TOC entry 5599 (class 2606 OID 88321)
-- Name: applications applications_applicationCode_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key74" UNIQUE ("applicationCode");


--
-- TOC entry 5601 (class 2606 OID 88185)
-- Name: applications applications_applicationCode_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key75" UNIQUE ("applicationCode");


--
-- TOC entry 5603 (class 2606 OID 88323)
-- Name: applications applications_applicationCode_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key76" UNIQUE ("applicationCode");


--
-- TOC entry 5605 (class 2606 OID 88183)
-- Name: applications applications_applicationCode_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key77" UNIQUE ("applicationCode");


--
-- TOC entry 5607 (class 2606 OID 88325)
-- Name: applications applications_applicationCode_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key78" UNIQUE ("applicationCode");


--
-- TOC entry 5609 (class 2606 OID 88181)
-- Name: applications applications_applicationCode_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key79" UNIQUE ("applicationCode");


--
-- TOC entry 5611 (class 2606 OID 88245)
-- Name: applications applications_applicationCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key8" UNIQUE ("applicationCode");


--
-- TOC entry 5613 (class 2606 OID 88327)
-- Name: applications applications_applicationCode_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key80" UNIQUE ("applicationCode");


--
-- TOC entry 5615 (class 2606 OID 88329)
-- Name: applications applications_applicationCode_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key81" UNIQUE ("applicationCode");


--
-- TOC entry 5617 (class 2606 OID 88179)
-- Name: applications applications_applicationCode_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key82" UNIQUE ("applicationCode");


--
-- TOC entry 5619 (class 2606 OID 88331)
-- Name: applications applications_applicationCode_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key83" UNIQUE ("applicationCode");


--
-- TOC entry 5621 (class 2606 OID 88333)
-- Name: applications applications_applicationCode_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key84" UNIQUE ("applicationCode");


--
-- TOC entry 5623 (class 2606 OID 88177)
-- Name: applications applications_applicationCode_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key85" UNIQUE ("applicationCode");


--
-- TOC entry 5625 (class 2606 OID 88335)
-- Name: applications applications_applicationCode_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key86" UNIQUE ("applicationCode");


--
-- TOC entry 5627 (class 2606 OID 88241)
-- Name: applications applications_applicationCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_applicationCode_key9" UNIQUE ("applicationCode");


--
-- TOC entry 5629 (class 2606 OID 37208)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 16713)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5643 (class 2606 OID 37286)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 5636 (class 2606 OID 37239)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5787 (class 2606 OID 85677)
-- Name: form_templates form_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT form_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5641 (class 2606 OID 37256)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5659 (class 2606 OID 44479)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5661 (class 2606 OID 88499)
-- Name: payments payments_receiptCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key" UNIQUE ("receiptCode");


--
-- TOC entry 5663 (class 2606 OID 88501)
-- Name: payments payments_receiptCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key1" UNIQUE ("receiptCode");


--
-- TOC entry 5665 (class 2606 OID 88511)
-- Name: payments payments_receiptCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key10" UNIQUE ("receiptCode");


--
-- TOC entry 5667 (class 2606 OID 88513)
-- Name: payments payments_receiptCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key11" UNIQUE ("receiptCode");


--
-- TOC entry 5669 (class 2606 OID 88545)
-- Name: payments payments_receiptCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key12" UNIQUE ("receiptCode");


--
-- TOC entry 5671 (class 2606 OID 88515)
-- Name: payments payments_receiptCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key13" UNIQUE ("receiptCode");


--
-- TOC entry 5673 (class 2606 OID 88517)
-- Name: payments payments_receiptCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key14" UNIQUE ("receiptCode");


--
-- TOC entry 5675 (class 2606 OID 88543)
-- Name: payments payments_receiptCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key15" UNIQUE ("receiptCode");


--
-- TOC entry 5677 (class 2606 OID 88519)
-- Name: payments payments_receiptCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key16" UNIQUE ("receiptCode");


--
-- TOC entry 5679 (class 2606 OID 88541)
-- Name: payments payments_receiptCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key17" UNIQUE ("receiptCode");


--
-- TOC entry 5681 (class 2606 OID 88521)
-- Name: payments payments_receiptCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key18" UNIQUE ("receiptCode");


--
-- TOC entry 5683 (class 2606 OID 88539)
-- Name: payments payments_receiptCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key19" UNIQUE ("receiptCode");


--
-- TOC entry 5685 (class 2606 OID 88503)
-- Name: payments payments_receiptCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key2" UNIQUE ("receiptCode");


--
-- TOC entry 5687 (class 2606 OID 88523)
-- Name: payments payments_receiptCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key20" UNIQUE ("receiptCode");


--
-- TOC entry 5689 (class 2606 OID 88537)
-- Name: payments payments_receiptCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key21" UNIQUE ("receiptCode");


--
-- TOC entry 5691 (class 2606 OID 88525)
-- Name: payments payments_receiptCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key22" UNIQUE ("receiptCode");


--
-- TOC entry 5693 (class 2606 OID 88535)
-- Name: payments payments_receiptCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key23" UNIQUE ("receiptCode");


--
-- TOC entry 5695 (class 2606 OID 88527)
-- Name: payments payments_receiptCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key24" UNIQUE ("receiptCode");


--
-- TOC entry 5697 (class 2606 OID 88533)
-- Name: payments payments_receiptCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key25" UNIQUE ("receiptCode");


--
-- TOC entry 5699 (class 2606 OID 88529)
-- Name: payments payments_receiptCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key26" UNIQUE ("receiptCode");


--
-- TOC entry 5701 (class 2606 OID 88531)
-- Name: payments payments_receiptCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key27" UNIQUE ("receiptCode");


--
-- TOC entry 5703 (class 2606 OID 88493)
-- Name: payments payments_receiptCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key28" UNIQUE ("receiptCode");


--
-- TOC entry 5705 (class 2606 OID 88491)
-- Name: payments payments_receiptCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key29" UNIQUE ("receiptCode");


--
-- TOC entry 5707 (class 2606 OID 88497)
-- Name: payments payments_receiptCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key3" UNIQUE ("receiptCode");


--
-- TOC entry 5709 (class 2606 OID 88551)
-- Name: payments payments_receiptCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key30" UNIQUE ("receiptCode");


--
-- TOC entry 5711 (class 2606 OID 88489)
-- Name: payments payments_receiptCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key31" UNIQUE ("receiptCode");


--
-- TOC entry 5713 (class 2606 OID 88553)
-- Name: payments payments_receiptCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key32" UNIQUE ("receiptCode");


--
-- TOC entry 5715 (class 2606 OID 88487)
-- Name: payments payments_receiptCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key33" UNIQUE ("receiptCode");


--
-- TOC entry 5717 (class 2606 OID 88555)
-- Name: payments payments_receiptCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key34" UNIQUE ("receiptCode");


--
-- TOC entry 5719 (class 2606 OID 88485)
-- Name: payments payments_receiptCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key35" UNIQUE ("receiptCode");


--
-- TOC entry 5721 (class 2606 OID 88557)
-- Name: payments payments_receiptCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key36" UNIQUE ("receiptCode");


--
-- TOC entry 5723 (class 2606 OID 88559)
-- Name: payments payments_receiptCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key37" UNIQUE ("receiptCode");


--
-- TOC entry 5725 (class 2606 OID 88483)
-- Name: payments payments_receiptCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key38" UNIQUE ("receiptCode");


--
-- TOC entry 5727 (class 2606 OID 88561)
-- Name: payments payments_receiptCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key39" UNIQUE ("receiptCode");


--
-- TOC entry 5729 (class 2606 OID 88505)
-- Name: payments payments_receiptCode_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key4" UNIQUE ("receiptCode");


--
-- TOC entry 5731 (class 2606 OID 88481)
-- Name: payments payments_receiptCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key40" UNIQUE ("receiptCode");


--
-- TOC entry 5733 (class 2606 OID 88563)
-- Name: payments payments_receiptCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key41" UNIQUE ("receiptCode");


--
-- TOC entry 5735 (class 2606 OID 88565)
-- Name: payments payments_receiptCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key42" UNIQUE ("receiptCode");


--
-- TOC entry 5737 (class 2606 OID 88567)
-- Name: payments payments_receiptCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key43" UNIQUE ("receiptCode");


--
-- TOC entry 5739 (class 2606 OID 88479)
-- Name: payments payments_receiptCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key44" UNIQUE ("receiptCode");


--
-- TOC entry 5741 (class 2606 OID 88569)
-- Name: payments payments_receiptCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key45" UNIQUE ("receiptCode");


--
-- TOC entry 5743 (class 2606 OID 88571)
-- Name: payments payments_receiptCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key46" UNIQUE ("receiptCode");


--
-- TOC entry 5745 (class 2606 OID 88573)
-- Name: payments payments_receiptCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key47" UNIQUE ("receiptCode");


--
-- TOC entry 5747 (class 2606 OID 88477)
-- Name: payments payments_receiptCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key48" UNIQUE ("receiptCode");


--
-- TOC entry 5749 (class 2606 OID 88575)
-- Name: payments payments_receiptCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key49" UNIQUE ("receiptCode");


--
-- TOC entry 5751 (class 2606 OID 88495)
-- Name: payments payments_receiptCode_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key5" UNIQUE ("receiptCode");


--
-- TOC entry 5753 (class 2606 OID 88475)
-- Name: payments payments_receiptCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key50" UNIQUE ("receiptCode");


--
-- TOC entry 5755 (class 2606 OID 88577)
-- Name: payments payments_receiptCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key51" UNIQUE ("receiptCode");


--
-- TOC entry 5757 (class 2606 OID 88473)
-- Name: payments payments_receiptCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key52" UNIQUE ("receiptCode");


--
-- TOC entry 5759 (class 2606 OID 88579)
-- Name: payments payments_receiptCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key53" UNIQUE ("receiptCode");


--
-- TOC entry 5761 (class 2606 OID 88581)
-- Name: payments payments_receiptCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key54" UNIQUE ("receiptCode");


--
-- TOC entry 5763 (class 2606 OID 88471)
-- Name: payments payments_receiptCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key55" UNIQUE ("receiptCode");


--
-- TOC entry 5765 (class 2606 OID 88583)
-- Name: payments payments_receiptCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key56" UNIQUE ("receiptCode");


--
-- TOC entry 5767 (class 2606 OID 88585)
-- Name: payments payments_receiptCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key57" UNIQUE ("receiptCode");


--
-- TOC entry 5769 (class 2606 OID 88469)
-- Name: payments payments_receiptCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key58" UNIQUE ("receiptCode");


--
-- TOC entry 5771 (class 2606 OID 88587)
-- Name: payments payments_receiptCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key59" UNIQUE ("receiptCode");


--
-- TOC entry 5773 (class 2606 OID 88507)
-- Name: payments payments_receiptCode_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key6" UNIQUE ("receiptCode");


--
-- TOC entry 5775 (class 2606 OID 88467)
-- Name: payments payments_receiptCode_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key60" UNIQUE ("receiptCode");


--
-- TOC entry 5777 (class 2606 OID 88589)
-- Name: payments payments_receiptCode_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key61" UNIQUE ("receiptCode");


--
-- TOC entry 5779 (class 2606 OID 88591)
-- Name: payments payments_receiptCode_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key62" UNIQUE ("receiptCode");


--
-- TOC entry 5781 (class 2606 OID 88549)
-- Name: payments payments_receiptCode_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key7" UNIQUE ("receiptCode");


--
-- TOC entry 5783 (class 2606 OID 88509)
-- Name: payments payments_receiptCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key8" UNIQUE ("receiptCode");


--
-- TOC entry 5785 (class 2606 OID 88547)
-- Name: payments payments_receiptCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_receiptCode_key9" UNIQUE ("receiptCode");


--
-- TOC entry 5655 (class 2606 OID 37369)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 5649 (class 2606 OID 37322)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5461 (class 2606 OID 37179)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 87757)
-- Name: users users_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key UNIQUE (cccd);


--
-- TOC entry 4963 (class 2606 OID 87641)
-- Name: users users_cccd_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key1 UNIQUE (cccd);


--
-- TOC entry 4965 (class 2606 OID 87761)
-- Name: users users_cccd_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key10 UNIQUE (cccd);


--
-- TOC entry 4967 (class 2606 OID 87753)
-- Name: users users_cccd_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key11 UNIQUE (cccd);


--
-- TOC entry 4969 (class 2606 OID 87763)
-- Name: users users_cccd_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key12 UNIQUE (cccd);


--
-- TOC entry 4971 (class 2606 OID 87751)
-- Name: users users_cccd_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key13 UNIQUE (cccd);


--
-- TOC entry 4973 (class 2606 OID 87765)
-- Name: users users_cccd_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key14 UNIQUE (cccd);


--
-- TOC entry 4975 (class 2606 OID 87767)
-- Name: users users_cccd_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key15 UNIQUE (cccd);


--
-- TOC entry 4977 (class 2606 OID 87769)
-- Name: users users_cccd_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key16 UNIQUE (cccd);


--
-- TOC entry 4979 (class 2606 OID 87749)
-- Name: users users_cccd_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key17 UNIQUE (cccd);


--
-- TOC entry 4981 (class 2606 OID 87771)
-- Name: users users_cccd_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key18 UNIQUE (cccd);


--
-- TOC entry 4983 (class 2606 OID 87747)
-- Name: users users_cccd_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key19 UNIQUE (cccd);


--
-- TOC entry 4985 (class 2606 OID 87639)
-- Name: users users_cccd_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key2 UNIQUE (cccd);


--
-- TOC entry 4987 (class 2606 OID 87773)
-- Name: users users_cccd_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key20 UNIQUE (cccd);


--
-- TOC entry 4989 (class 2606 OID 87745)
-- Name: users users_cccd_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key21 UNIQUE (cccd);


--
-- TOC entry 4991 (class 2606 OID 87775)
-- Name: users users_cccd_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key22 UNIQUE (cccd);


--
-- TOC entry 4993 (class 2606 OID 87743)
-- Name: users users_cccd_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key23 UNIQUE (cccd);


--
-- TOC entry 4995 (class 2606 OID 87777)
-- Name: users users_cccd_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key24 UNIQUE (cccd);


--
-- TOC entry 4997 (class 2606 OID 87741)
-- Name: users users_cccd_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key25 UNIQUE (cccd);


--
-- TOC entry 4999 (class 2606 OID 87779)
-- Name: users users_cccd_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key26 UNIQUE (cccd);


--
-- TOC entry 5001 (class 2606 OID 87739)
-- Name: users users_cccd_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key27 UNIQUE (cccd);


--
-- TOC entry 5003 (class 2606 OID 87781)
-- Name: users users_cccd_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key28 UNIQUE (cccd);


--
-- TOC entry 5005 (class 2606 OID 87661)
-- Name: users users_cccd_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key29 UNIQUE (cccd);


--
-- TOC entry 5007 (class 2606 OID 87803)
-- Name: users users_cccd_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key3 UNIQUE (cccd);


--
-- TOC entry 5009 (class 2606 OID 87737)
-- Name: users users_cccd_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key30 UNIQUE (cccd);


--
-- TOC entry 5011 (class 2606 OID 87663)
-- Name: users users_cccd_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key31 UNIQUE (cccd);


--
-- TOC entry 5013 (class 2606 OID 87735)
-- Name: users users_cccd_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key32 UNIQUE (cccd);


--
-- TOC entry 5015 (class 2606 OID 87665)
-- Name: users users_cccd_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key33 UNIQUE (cccd);


--
-- TOC entry 5017 (class 2606 OID 87733)
-- Name: users users_cccd_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key34 UNIQUE (cccd);


--
-- TOC entry 5019 (class 2606 OID 87783)
-- Name: users users_cccd_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key35 UNIQUE (cccd);


--
-- TOC entry 5021 (class 2606 OID 87785)
-- Name: users users_cccd_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key36 UNIQUE (cccd);


--
-- TOC entry 5023 (class 2606 OID 87731)
-- Name: users users_cccd_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key37 UNIQUE (cccd);


--
-- TOC entry 5025 (class 2606 OID 87787)
-- Name: users users_cccd_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key38 UNIQUE (cccd);


--
-- TOC entry 5027 (class 2606 OID 87729)
-- Name: users users_cccd_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key39 UNIQUE (cccd);


--
-- TOC entry 5029 (class 2606 OID 87727)
-- Name: users users_cccd_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key40 UNIQUE (cccd);


--
-- TOC entry 5031 (class 2606 OID 87789)
-- Name: users users_cccd_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key41 UNIQUE (cccd);


--
-- TOC entry 5033 (class 2606 OID 87725)
-- Name: users users_cccd_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key42 UNIQUE (cccd);


--
-- TOC entry 5035 (class 2606 OID 87671)
-- Name: users users_cccd_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key43 UNIQUE (cccd);


--
-- TOC entry 5037 (class 2606 OID 87723)
-- Name: users users_cccd_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key44 UNIQUE (cccd);


--
-- TOC entry 5039 (class 2606 OID 87673)
-- Name: users users_cccd_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key45 UNIQUE (cccd);


--
-- TOC entry 5041 (class 2606 OID 87721)
-- Name: users users_cccd_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key46 UNIQUE (cccd);


--
-- TOC entry 5043 (class 2606 OID 87719)
-- Name: users users_cccd_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key47 UNIQUE (cccd);


--
-- TOC entry 5045 (class 2606 OID 87717)
-- Name: users users_cccd_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key48 UNIQUE (cccd);


--
-- TOC entry 5047 (class 2606 OID 87715)
-- Name: users users_cccd_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key49 UNIQUE (cccd);


--
-- TOC entry 5049 (class 2606 OID 87713)
-- Name: users users_cccd_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key50 UNIQUE (cccd);


--
-- TOC entry 5051 (class 2606 OID 87711)
-- Name: users users_cccd_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key51 UNIQUE (cccd);


--
-- TOC entry 5053 (class 2606 OID 87709)
-- Name: users users_cccd_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key52 UNIQUE (cccd);


--
-- TOC entry 5055 (class 2606 OID 87707)
-- Name: users users_cccd_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key53 UNIQUE (cccd);


--
-- TOC entry 5057 (class 2606 OID 87705)
-- Name: users users_cccd_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key54 UNIQUE (cccd);


--
-- TOC entry 5059 (class 2606 OID 87675)
-- Name: users users_cccd_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key55 UNIQUE (cccd);


--
-- TOC entry 5061 (class 2606 OID 87703)
-- Name: users users_cccd_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key56 UNIQUE (cccd);


--
-- TOC entry 5063 (class 2606 OID 87701)
-- Name: users users_cccd_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key57 UNIQUE (cccd);


--
-- TOC entry 5065 (class 2606 OID 87699)
-- Name: users users_cccd_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key58 UNIQUE (cccd);


--
-- TOC entry 5067 (class 2606 OID 87697)
-- Name: users users_cccd_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key59 UNIQUE (cccd);


--
-- TOC entry 5069 (class 2606 OID 87695)
-- Name: users users_cccd_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key60 UNIQUE (cccd);


--
-- TOC entry 5071 (class 2606 OID 87693)
-- Name: users users_cccd_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key61 UNIQUE (cccd);


--
-- TOC entry 5073 (class 2606 OID 87691)
-- Name: users users_cccd_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key62 UNIQUE (cccd);


--
-- TOC entry 5075 (class 2606 OID 87689)
-- Name: users users_cccd_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key63 UNIQUE (cccd);


--
-- TOC entry 5077 (class 2606 OID 87677)
-- Name: users users_cccd_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key64 UNIQUE (cccd);


--
-- TOC entry 5079 (class 2606 OID 87687)
-- Name: users users_cccd_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key65 UNIQUE (cccd);


--
-- TOC entry 5081 (class 2606 OID 87685)
-- Name: users users_cccd_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key66 UNIQUE (cccd);


--
-- TOC entry 5083 (class 2606 OID 87683)
-- Name: users users_cccd_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key67 UNIQUE (cccd);


--
-- TOC entry 5085 (class 2606 OID 87681)
-- Name: users users_cccd_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key68 UNIQUE (cccd);


--
-- TOC entry 5087 (class 2606 OID 87679)
-- Name: users users_cccd_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key69 UNIQUE (cccd);


--
-- TOC entry 5089 (class 2606 OID 87791)
-- Name: users users_cccd_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key70 UNIQUE (cccd);


--
-- TOC entry 5091 (class 2606 OID 87669)
-- Name: users users_cccd_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key71 UNIQUE (cccd);


--
-- TOC entry 5093 (class 2606 OID 87667)
-- Name: users users_cccd_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key72 UNIQUE (cccd);


--
-- TOC entry 5095 (class 2606 OID 87793)
-- Name: users users_cccd_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key73 UNIQUE (cccd);


--
-- TOC entry 5097 (class 2606 OID 87795)
-- Name: users users_cccd_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key74 UNIQUE (cccd);


--
-- TOC entry 5099 (class 2606 OID 87659)
-- Name: users users_cccd_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key75 UNIQUE (cccd);


--
-- TOC entry 5101 (class 2606 OID 87657)
-- Name: users users_cccd_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key76 UNIQUE (cccd);


--
-- TOC entry 5103 (class 2606 OID 87655)
-- Name: users users_cccd_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key77 UNIQUE (cccd);


--
-- TOC entry 5105 (class 2606 OID 87653)
-- Name: users users_cccd_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key78 UNIQUE (cccd);


--
-- TOC entry 5107 (class 2606 OID 87651)
-- Name: users users_cccd_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key79 UNIQUE (cccd);


--
-- TOC entry 5109 (class 2606 OID 87759)
-- Name: users users_cccd_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key8 UNIQUE (cccd);


--
-- TOC entry 5111 (class 2606 OID 87649)
-- Name: users users_cccd_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key80 UNIQUE (cccd);


--
-- TOC entry 5113 (class 2606 OID 87797)
-- Name: users users_cccd_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key81 UNIQUE (cccd);


--
-- TOC entry 5115 (class 2606 OID 87647)
-- Name: users users_cccd_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key82 UNIQUE (cccd);


--
-- TOC entry 5117 (class 2606 OID 87645)
-- Name: users users_cccd_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key83 UNIQUE (cccd);


--
-- TOC entry 5119 (class 2606 OID 87799)
-- Name: users users_cccd_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key84 UNIQUE (cccd);


--
-- TOC entry 5121 (class 2606 OID 87643)
-- Name: users users_cccd_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key85 UNIQUE (cccd);


--
-- TOC entry 5123 (class 2606 OID 87801)
-- Name: users users_cccd_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key86 UNIQUE (cccd);


--
-- TOC entry 5125 (class 2606 OID 87755)
-- Name: users users_cccd_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cccd_key9 UNIQUE (cccd);


--
-- TOC entry 5127 (class 2606 OID 87879)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5129 (class 2606 OID 87811)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 5131 (class 2606 OID 87883)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 5133 (class 2606 OID 87875)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 5135 (class 2606 OID 87885)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 5137 (class 2606 OID 87873)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 5139 (class 2606 OID 87887)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 5141 (class 2606 OID 87889)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 5143 (class 2606 OID 87891)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 5145 (class 2606 OID 87871)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 5147 (class 2606 OID 87893)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 5149 (class 2606 OID 87869)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 5151 (class 2606 OID 87809)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 5153 (class 2606 OID 87895)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 5155 (class 2606 OID 87867)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 5157 (class 2606 OID 87897)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 5159 (class 2606 OID 87865)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 5161 (class 2606 OID 87899)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 5163 (class 2606 OID 87863)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 5165 (class 2606 OID 87901)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 5167 (class 2606 OID 87861)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 5169 (class 2606 OID 87903)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 5171 (class 2606 OID 87905)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 5173 (class 2606 OID 87973)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 5175 (class 2606 OID 87859)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 5177 (class 2606 OID 87907)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 5179 (class 2606 OID 87857)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 5181 (class 2606 OID 87909)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 5183 (class 2606 OID 87855)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 5185 (class 2606 OID 87911)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 5187 (class 2606 OID 87913)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 5189 (class 2606 OID 87853)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 5191 (class 2606 OID 87915)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 5193 (class 2606 OID 87851)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 5195 (class 2606 OID 87917)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 5197 (class 2606 OID 87919)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 5199 (class 2606 OID 87849)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 5201 (class 2606 OID 87921)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 5203 (class 2606 OID 87847)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 5205 (class 2606 OID 87923)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 5207 (class 2606 OID 87845)
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- TOC entry 5209 (class 2606 OID 87925)
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- TOC entry 5211 (class 2606 OID 87843)
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- TOC entry 5213 (class 2606 OID 87927)
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- TOC entry 5215 (class 2606 OID 87841)
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- TOC entry 5217 (class 2606 OID 87929)
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- TOC entry 5219 (class 2606 OID 87839)
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- TOC entry 5221 (class 2606 OID 87931)
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- TOC entry 5223 (class 2606 OID 87837)
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- TOC entry 5225 (class 2606 OID 87933)
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- TOC entry 5227 (class 2606 OID 87835)
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- TOC entry 5229 (class 2606 OID 87935)
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- TOC entry 5231 (class 2606 OID 87833)
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- TOC entry 5233 (class 2606 OID 87937)
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- TOC entry 5235 (class 2606 OID 87831)
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- TOC entry 5237 (class 2606 OID 87939)
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- TOC entry 5239 (class 2606 OID 87829)
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- TOC entry 5241 (class 2606 OID 87941)
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- TOC entry 5243 (class 2606 OID 87943)
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- TOC entry 5245 (class 2606 OID 87827)
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- TOC entry 5247 (class 2606 OID 87945)
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- TOC entry 5249 (class 2606 OID 87825)
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- TOC entry 5251 (class 2606 OID 87947)
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- TOC entry 5253 (class 2606 OID 87949)
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- TOC entry 5255 (class 2606 OID 87951)
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- TOC entry 5257 (class 2606 OID 87823)
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- TOC entry 5259 (class 2606 OID 87953)
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- TOC entry 5261 (class 2606 OID 87955)
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- TOC entry 5263 (class 2606 OID 87957)
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- TOC entry 5265 (class 2606 OID 87821)
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- TOC entry 5267 (class 2606 OID 87959)
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- TOC entry 5269 (class 2606 OID 87819)
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- TOC entry 5271 (class 2606 OID 87961)
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- TOC entry 5273 (class 2606 OID 87817)
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- TOC entry 5275 (class 2606 OID 87881)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 5277 (class 2606 OID 87963)
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- TOC entry 5279 (class 2606 OID 87965)
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- TOC entry 5281 (class 2606 OID 87815)
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- TOC entry 5283 (class 2606 OID 87967)
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- TOC entry 5285 (class 2606 OID 87969)
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- TOC entry 5287 (class 2606 OID 87813)
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- TOC entry 5289 (class 2606 OID 87971)
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- TOC entry 5291 (class 2606 OID 87877)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 5293 (class 2606 OID 88053)
-- Name: users users_officerCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key" UNIQUE ("officerCode");


--
-- TOC entry 5295 (class 2606 OID 87985)
-- Name: users users_officerCode_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key1" UNIQUE ("officerCode");


--
-- TOC entry 5297 (class 2606 OID 88057)
-- Name: users users_officerCode_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key10" UNIQUE ("officerCode");


--
-- TOC entry 5299 (class 2606 OID 88049)
-- Name: users users_officerCode_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key11" UNIQUE ("officerCode");


--
-- TOC entry 5301 (class 2606 OID 88059)
-- Name: users users_officerCode_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key12" UNIQUE ("officerCode");


--
-- TOC entry 5303 (class 2606 OID 88047)
-- Name: users users_officerCode_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key13" UNIQUE ("officerCode");


--
-- TOC entry 5305 (class 2606 OID 88061)
-- Name: users users_officerCode_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key14" UNIQUE ("officerCode");


--
-- TOC entry 5307 (class 2606 OID 88063)
-- Name: users users_officerCode_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key15" UNIQUE ("officerCode");


--
-- TOC entry 5309 (class 2606 OID 88065)
-- Name: users users_officerCode_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key16" UNIQUE ("officerCode");


--
-- TOC entry 5311 (class 2606 OID 88045)
-- Name: users users_officerCode_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key17" UNIQUE ("officerCode");


--
-- TOC entry 5313 (class 2606 OID 88067)
-- Name: users users_officerCode_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key18" UNIQUE ("officerCode");


--
-- TOC entry 5315 (class 2606 OID 88043)
-- Name: users users_officerCode_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key19" UNIQUE ("officerCode");


--
-- TOC entry 5317 (class 2606 OID 88147)
-- Name: users users_officerCode_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key2" UNIQUE ("officerCode");


--
-- TOC entry 5319 (class 2606 OID 88069)
-- Name: users users_officerCode_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key20" UNIQUE ("officerCode");


--
-- TOC entry 5321 (class 2606 OID 88041)
-- Name: users users_officerCode_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key21" UNIQUE ("officerCode");


--
-- TOC entry 5323 (class 2606 OID 88071)
-- Name: users users_officerCode_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key22" UNIQUE ("officerCode");


--
-- TOC entry 5325 (class 2606 OID 88039)
-- Name: users users_officerCode_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key23" UNIQUE ("officerCode");


--
-- TOC entry 5327 (class 2606 OID 88073)
-- Name: users users_officerCode_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key24" UNIQUE ("officerCode");


--
-- TOC entry 5329 (class 2606 OID 88037)
-- Name: users users_officerCode_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key25" UNIQUE ("officerCode");


--
-- TOC entry 5331 (class 2606 OID 88075)
-- Name: users users_officerCode_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key26" UNIQUE ("officerCode");


--
-- TOC entry 5333 (class 2606 OID 88035)
-- Name: users users_officerCode_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key27" UNIQUE ("officerCode");


--
-- TOC entry 5335 (class 2606 OID 88077)
-- Name: users users_officerCode_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key28" UNIQUE ("officerCode");


--
-- TOC entry 5337 (class 2606 OID 88079)
-- Name: users users_officerCode_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key29" UNIQUE ("officerCode");


--
-- TOC entry 5339 (class 2606 OID 88149)
-- Name: users users_officerCode_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key3" UNIQUE ("officerCode");


--
-- TOC entry 5341 (class 2606 OID 88033)
-- Name: users users_officerCode_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key30" UNIQUE ("officerCode");


--
-- TOC entry 5343 (class 2606 OID 88081)
-- Name: users users_officerCode_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key31" UNIQUE ("officerCode");


--
-- TOC entry 5345 (class 2606 OID 88031)
-- Name: users users_officerCode_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key32" UNIQUE ("officerCode");


--
-- TOC entry 5347 (class 2606 OID 88083)
-- Name: users users_officerCode_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key33" UNIQUE ("officerCode");


--
-- TOC entry 5349 (class 2606 OID 88029)
-- Name: users users_officerCode_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key34" UNIQUE ("officerCode");


--
-- TOC entry 5351 (class 2606 OID 88085)
-- Name: users users_officerCode_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key35" UNIQUE ("officerCode");


--
-- TOC entry 5353 (class 2606 OID 88087)
-- Name: users users_officerCode_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key36" UNIQUE ("officerCode");


--
-- TOC entry 5355 (class 2606 OID 88027)
-- Name: users users_officerCode_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key37" UNIQUE ("officerCode");


--
-- TOC entry 5357 (class 2606 OID 88089)
-- Name: users users_officerCode_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key38" UNIQUE ("officerCode");


--
-- TOC entry 5359 (class 2606 OID 88025)
-- Name: users users_officerCode_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key39" UNIQUE ("officerCode");


--
-- TOC entry 5361 (class 2606 OID 88091)
-- Name: users users_officerCode_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key40" UNIQUE ("officerCode");


--
-- TOC entry 5363 (class 2606 OID 88093)
-- Name: users users_officerCode_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key41" UNIQUE ("officerCode");


--
-- TOC entry 5365 (class 2606 OID 88023)
-- Name: users users_officerCode_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key42" UNIQUE ("officerCode");


--
-- TOC entry 5367 (class 2606 OID 88095)
-- Name: users users_officerCode_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key43" UNIQUE ("officerCode");


--
-- TOC entry 5369 (class 2606 OID 88021)
-- Name: users users_officerCode_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key44" UNIQUE ("officerCode");


--
-- TOC entry 5371 (class 2606 OID 88097)
-- Name: users users_officerCode_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key45" UNIQUE ("officerCode");


--
-- TOC entry 5373 (class 2606 OID 88019)
-- Name: users users_officerCode_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key46" UNIQUE ("officerCode");


--
-- TOC entry 5375 (class 2606 OID 88099)
-- Name: users users_officerCode_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key47" UNIQUE ("officerCode");


--
-- TOC entry 5377 (class 2606 OID 88017)
-- Name: users users_officerCode_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key48" UNIQUE ("officerCode");


--
-- TOC entry 5379 (class 2606 OID 88101)
-- Name: users users_officerCode_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key49" UNIQUE ("officerCode");


--
-- TOC entry 5381 (class 2606 OID 88015)
-- Name: users users_officerCode_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key50" UNIQUE ("officerCode");


--
-- TOC entry 5383 (class 2606 OID 88103)
-- Name: users users_officerCode_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key51" UNIQUE ("officerCode");


--
-- TOC entry 5385 (class 2606 OID 88013)
-- Name: users users_officerCode_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key52" UNIQUE ("officerCode");


--
-- TOC entry 5387 (class 2606 OID 88105)
-- Name: users users_officerCode_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key53" UNIQUE ("officerCode");


--
-- TOC entry 5389 (class 2606 OID 88011)
-- Name: users users_officerCode_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key54" UNIQUE ("officerCode");


--
-- TOC entry 5391 (class 2606 OID 88107)
-- Name: users users_officerCode_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key55" UNIQUE ("officerCode");


--
-- TOC entry 5393 (class 2606 OID 88009)
-- Name: users users_officerCode_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key56" UNIQUE ("officerCode");


--
-- TOC entry 5395 (class 2606 OID 88109)
-- Name: users users_officerCode_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key57" UNIQUE ("officerCode");


--
-- TOC entry 5397 (class 2606 OID 88007)
-- Name: users users_officerCode_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key58" UNIQUE ("officerCode");


--
-- TOC entry 5399 (class 2606 OID 88111)
-- Name: users users_officerCode_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key59" UNIQUE ("officerCode");


--
-- TOC entry 5401 (class 2606 OID 88005)
-- Name: users users_officerCode_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key60" UNIQUE ("officerCode");


--
-- TOC entry 5403 (class 2606 OID 88113)
-- Name: users users_officerCode_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key61" UNIQUE ("officerCode");


--
-- TOC entry 5405 (class 2606 OID 88003)
-- Name: users users_officerCode_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key62" UNIQUE ("officerCode");


--
-- TOC entry 5407 (class 2606 OID 88115)
-- Name: users users_officerCode_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key63" UNIQUE ("officerCode");


--
-- TOC entry 5409 (class 2606 OID 88117)
-- Name: users users_officerCode_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key64" UNIQUE ("officerCode");


--
-- TOC entry 5411 (class 2606 OID 88001)
-- Name: users users_officerCode_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key65" UNIQUE ("officerCode");


--
-- TOC entry 5413 (class 2606 OID 88119)
-- Name: users users_officerCode_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key66" UNIQUE ("officerCode");


--
-- TOC entry 5415 (class 2606 OID 87999)
-- Name: users users_officerCode_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key67" UNIQUE ("officerCode");


--
-- TOC entry 5417 (class 2606 OID 88121)
-- Name: users users_officerCode_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key68" UNIQUE ("officerCode");


--
-- TOC entry 5419 (class 2606 OID 88123)
-- Name: users users_officerCode_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key69" UNIQUE ("officerCode");


--
-- TOC entry 5421 (class 2606 OID 88125)
-- Name: users users_officerCode_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key70" UNIQUE ("officerCode");


--
-- TOC entry 5423 (class 2606 OID 87997)
-- Name: users users_officerCode_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key71" UNIQUE ("officerCode");


--
-- TOC entry 5425 (class 2606 OID 88127)
-- Name: users users_officerCode_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key72" UNIQUE ("officerCode");


--
-- TOC entry 5427 (class 2606 OID 88129)
-- Name: users users_officerCode_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key73" UNIQUE ("officerCode");


--
-- TOC entry 5429 (class 2606 OID 88131)
-- Name: users users_officerCode_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key74" UNIQUE ("officerCode");


--
-- TOC entry 5431 (class 2606 OID 87995)
-- Name: users users_officerCode_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key75" UNIQUE ("officerCode");


--
-- TOC entry 5433 (class 2606 OID 88133)
-- Name: users users_officerCode_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key76" UNIQUE ("officerCode");


--
-- TOC entry 5435 (class 2606 OID 87993)
-- Name: users users_officerCode_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key77" UNIQUE ("officerCode");


--
-- TOC entry 5437 (class 2606 OID 88135)
-- Name: users users_officerCode_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key78" UNIQUE ("officerCode");


--
-- TOC entry 5439 (class 2606 OID 87991)
-- Name: users users_officerCode_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key79" UNIQUE ("officerCode");


--
-- TOC entry 5441 (class 2606 OID 88055)
-- Name: users users_officerCode_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key8" UNIQUE ("officerCode");


--
-- TOC entry 5443 (class 2606 OID 88137)
-- Name: users users_officerCode_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key80" UNIQUE ("officerCode");


--
-- TOC entry 5445 (class 2606 OID 88139)
-- Name: users users_officerCode_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key81" UNIQUE ("officerCode");


--
-- TOC entry 5447 (class 2606 OID 87989)
-- Name: users users_officerCode_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key82" UNIQUE ("officerCode");


--
-- TOC entry 5449 (class 2606 OID 88141)
-- Name: users users_officerCode_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key83" UNIQUE ("officerCode");


--
-- TOC entry 5451 (class 2606 OID 88143)
-- Name: users users_officerCode_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key84" UNIQUE ("officerCode");


--
-- TOC entry 5453 (class 2606 OID 87987)
-- Name: users users_officerCode_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key85" UNIQUE ("officerCode");


--
-- TOC entry 5455 (class 2606 OID 88145)
-- Name: users users_officerCode_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key86" UNIQUE ("officerCode");


--
-- TOC entry 5457 (class 2606 OID 88051)
-- Name: users users_officerCode_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_officerCode_key9" UNIQUE ("officerCode");


--
-- TOC entry 5459 (class 2606 OID 37154)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5652 (class 1259 OID 85653)
-- Name: idx_app_histories_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_app_histories_applicationid ON public.application_histories USING btree ("applicationId");


--
-- TOC entry 5630 (class 1259 OID 88359)
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status ON public.applications USING btree (status);


--
-- TOC entry 5631 (class 1259 OID 88363)
-- Name: idx_applications_status_submittedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status_submittedat ON public.applications USING btree (status, "submittedAt");


--
-- TOC entry 5632 (class 1259 OID 88362)
-- Name: idx_applications_submittedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_submittedat ON public.applications USING btree ("submittedAt");


--
-- TOC entry 5633 (class 1259 OID 85645)
-- Name: idx_applications_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_userid ON public.applications USING btree ("userId");


--
-- TOC entry 5634 (class 1259 OID 88360)
-- Name: idx_applications_userid_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_userid_status ON public.applications USING btree ("userId", status);


--
-- TOC entry 4954 (class 1259 OID 16720)
-- Name: idx_audit_hanh_dong; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_hanh_dong ON public.audit_logs USING btree (hanh_dong);


--
-- TOC entry 4955 (class 1259 OID 16719)
-- Name: idx_audit_nguoi_dung; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_nguoi_dung ON public.audit_logs USING btree (nguoi_dung_id);


--
-- TOC entry 4956 (class 1259 OID 16721)
-- Name: idx_audit_thoi_gian; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_thoi_gian ON public.audit_logs USING btree (thoi_gian);


--
-- TOC entry 5644 (class 1259 OID 85654)
-- Name: idx_comments_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_applicationid ON public.comments USING btree ("applicationId");


--
-- TOC entry 5637 (class 1259 OID 85650)
-- Name: idx_documents_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_applicationid ON public.documents USING btree ("applicationId");


--
-- TOC entry 5638 (class 1259 OID 85651)
-- Name: idx_notifications_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_userid ON public.notifications USING btree ("userId");


--
-- TOC entry 5639 (class 1259 OID 88395)
-- Name: idx_notifications_userid_isread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_userid_isread ON public.notifications USING btree ("userId", "isRead");


--
-- TOC entry 5656 (class 1259 OID 85656)
-- Name: idx_payments_applicationid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_applicationid ON public.payments USING btree ("applicationId");


--
-- TOC entry 5657 (class 1259 OID 85655)
-- Name: idx_payments_userid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_userid ON public.payments USING btree ("userId");


--
-- TOC entry 5653 (class 1259 OID 88456)
-- Name: idx_posts_ispublished_publishedat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_ispublished_publishedat ON public.posts USING btree ("isPublished", "publishedAt");


--
-- TOC entry 5647 (class 1259 OID 88429)
-- Name: idx_schedules_userid_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_userid_date ON public.schedules USING btree ("userId", date);


--
-- TOC entry 4957 (class 1259 OID 87804)
-- Name: idx_users_cccd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_cccd ON public.users USING btree (cccd);


--
-- TOC entry 4958 (class 1259 OID 87974)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4959 (class 1259 OID 87979)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5796 (class 2606 OID 88415)
-- Name: ai_logs ai_logs_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_logs
    ADD CONSTRAINT "ai_logs_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5798 (class 2606 OID 88442)
-- Name: application_histories application_histories_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5799 (class 2606 OID 88437)
-- Name: application_histories application_histories_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_histories
    ADD CONSTRAINT "application_histories_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5788 (class 2606 OID 88350)
-- Name: applications applications_officerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5789 (class 2606 OID 88345)
-- Name: applications applications_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5790 (class 2606 OID 88340)
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5794 (class 2606 OID 88398)
-- Name: comments comments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5795 (class 2606 OID 88403)
-- Name: comments comments_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5791 (class 2606 OID 88372)
-- Name: documents documents_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5803 (class 2606 OID 88613)
-- Name: form_templates form_templates_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT "form_templates_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5792 (class 2606 OID 88388)
-- Name: notifications notifications_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE;


--
-- TOC entry 5793 (class 2606 OID 88383)
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5801 (class 2606 OID 88593)
-- Name: payments payments_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5802 (class 2606 OID 88598)
-- Name: payments payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5800 (class 2606 OID 88457)
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5797 (class 2606 OID 88422)
-- Name: schedules schedules_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-05-26 15:25:13

--
-- PostgreSQL database dump complete
--

\unrestrict nw3qHtNLhgZ6LvoeTG4y11mhKN0Rob9E4l09cwxVKx5oHLCHSMVcZagIEfyT6Cl

