--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: authenticationservice_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO authenticationservice_user;

--
-- Name: entity_seq; Type: SEQUENCE; Schema: public; Owner: authenticationservice_user
--

CREATE SEQUENCE public.entity_seq
    START WITH 10000000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entity_seq OWNER TO authenticationservice_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: student_auth; Type: TABLE; Schema: public; Owner: authenticationservice_user
--

CREATE TABLE public.student_auth (
    id bigint NOT NULL,
    password character varying(255),
    role smallint,
    CONSTRAINT student_auth_role_check CHECK (((role >= 0) AND (role <= 3)))
);


ALTER TABLE public.student_auth OWNER TO authenticationservice_user;

--
-- Data for Name: student_auth; Type: TABLE DATA; Schema: public; Owner: authenticationservice_user
--

COPY public.student_auth (id, password, role) FROM stdin;
10000000	$2a$10$N0oLiMRJJ7Ak9A0fHxqbdO.Bj1Q5Xnz/E2tFRP30b90SZ3/POybUK	3
10000001	$2a$10$fqFXDAMzeduE6ON8Qopv/O/KEVuCVZF3mtVhm6VxVYopefST4Npsa	2
10000002	$2a$10$VNDTXWAR1TIMrwflM2mEVOmnnTIlLZaQS2Pw74P0dwPp7Yshba1WK	2
10000003	$2a$10$NVIcVQBGD2AjR8I/JZ0OCOv4wWjrQ4DSKlgEKPTWcUi8/ppqJSpfu	2
10000004	$2a$10$iQWnGJ6n418RfoedYreyhesPgyFKdVVBgL81ih9ciA0DpNnG4wdMe	2
10000005	$2a$10$mO.Dou1qDxnoiobdYmxyz.iSO2tD2b8hNU.jOsBcorNghrEQargWW	2
10000006	$2a$10$nuBroVfPoudwEoFeMtQNu.skhWRqJALnW6W6kBTjeco0TJHyVsgF.	2
10000007	$2a$10$xyoDhF1Hq0t8qylG6ENGluVpbaC6CvbWVGF8evUuIG7V9R0gyRlBq	2
10000008	$2a$10$sN0z.oQXgK25nV6r7hi3buMwtIighbybZJW6lAewkO5wrSfV9TE32	2
10000009	$2a$10$MGXNE24.hGxvDVbLNf92Hum575XKA0cM9h6mbTcl0gTOh1JF8bLcK	2
10000010	$2a$10$3pXthmG1toRKRhin.83xkurFNqVR99RUanrRDdZrefMH5ttj5wieG	1
10000011	$2a$10$3COwKYWXbm9/p8XTwMvXo.QND5oN0HW0zKJ7Moph0tOPKQ.j7wsRe	1
10000012	$2a$10$ZFtwjMyfK3Gpz70yNHCngOndvGnKr6SbVEGqDbs/J69szwAgu74ey	1
10000013	$2a$10$pnzDlLLuDYAC5mxvI50iKeZq9kOsFfQmXCM49zp0QQiT1apjXgENy	1
10000014	$2a$10$gzZDZ.oOGCUC/z3sWhxf1exXH3d71Q93INLxY6zu4CrWrJim9U1AK	1
10000015	$2a$10$/0AikZPDF8soldhJFW/Dcehr33D8qBvvbla7zGHZMVIn/FzCXHvXm	1
10000016	$2a$10$4vBkYnIZNjxpY.XXjtTRrekAtdSL6x/0bWsObQ2q59Ncj6YsAD7nu	1
10000017	$2a$10$S4m1m9PRocmoQQkAkUcgBOF3LMYa1An5y5gVYh0XRrlamjRwo7q.G	1
10000018	$2a$10$8sxDDppcCH50YDaJwJNJDOA3fdG.jxeR9MU6Z907euc2yV30YzOzi	1
10000019	$2a$10$G9i54/Jzku3xF3s9.CcEZuScn4iPJiUyLecHq58ZXaGzDpEaj1zsy	1
10000020	$2a$10$kSdBJMl5q5Du4hsO2u5i5em9.GKlXTQhV9ak159ASxkte7DugqmxG	1
10000021	$2a$10$kWqq.90fSTjdE0pylncue.9V8PdWrMKCsTRY3MBUR1CsxkztIiW.e	1
10000022	$2a$10$WynY6SWo4nDKBqhuVx63uOhRfSzZHlQoGCJmlzYl6njY7JAW4l4q2	1
10000023	$2a$10$.6fvhgnJFUXnJBx769sCVu2OJwRUUAVSuF9F9ob8LAg.MtOk06GWG	1
10000024	$2a$10$PHuIOeShOkrCd2k16hPw8OFeSZJl9fxQ07mCg/HduVt9Ee3FfLVjW	1
10000025	$2a$10$MvAUtj24t.SH59TrSUq2/uliy3bKvgNa9LuyuXS1b0QH81Swhq8WK	1
10000026	$2a$10$/UPQmui81f0dbPpzVH3sme8CkJ5MrwT0UZ2DnGzLhTaKe2XR7DhBO	1
10000027	$2a$10$SSg1SAPF0iuKCAtcV70Xk.LK/l7Ixo2VcdtScujOahKpkSEZ0.UKy	1
10000028	$2a$10$/9sOc0EysjCizUOKkaO2IO7WXxgLQXnXMMwB5TM2j/dXrypIMJ/IG	1
10000029	$2a$10$UaMPJKPXR3T307I6q1h40.mM/068LyFph2iGBHENqHDFR/TxTCXWK	1
10000030	$2a$10$KXkyURteL7ZAWTE6EvS1F.mfdk43Yu3LQJLpsITQSvN9iGzLJCDbG	1
10000031	$2a$10$ATtJOnpNh0riLQRq5Oy.PeBkM2e6fDE.QqiTCADrOEAWnUqtAlDFe	1
10000032	$2a$10$jevrYWJuxT4eqX/Xi0dnVuxNUUhD4eCD6f93wDWYjy9OilVQcPqAy	1
10000033	$2a$10$MJ27.5Pkdny/vBU7X2qGzOnzGFzJzM1lsB5UkOXUsOxtQILTVgKKy	1
10000034	$2a$10$EdSQKJyH3mNKnqhNiD1JIOg3RL..mOxBJkg.otOJrPFmQK5wGSVsu	1
10000035	$2a$10$xisQC5PIIrCAuUCG5Luqv.BKAfAjY4kjzXaxRZoWNVMaqqbo23aZC	1
10000036	$2a$10$WLV7mSInMw4OzDjYq/Icq.fo6FIcTzMD7LPBHo6Trc0C.WlsKQjYq	1
10000037	$2a$10$OiWhdR.MM1lOw6afToACveDKB6VOVakb5HEsVbkyYDiruMb8yC8Eq	1
10000038	$2a$10$Es8biVVKQeQjBqtH/j3X4OugoHrqx6CUfe/oL9OYD2wQn6ydCCEXy	1
10000039	$2a$10$oGgA0AnSE9.XAdTnQydaE.u5ktGoSaIXN8kJfkqK0nu/.UAtpxD6S	1
10000040	$2a$10$rei0t5intBpz2fmQYOBK4OrP1li7yeDPqduCp5ab67pvXYv5IKa0m	1
10000041	$2a$10$ifmdGWVGMo/uf.oMVhTA4.tTM/bQvuzvJeWJWF7pM3Q89i7OzaxPO	1
10000042	$2a$10$x/3PgrZs83TLtbV5uP3Sceb585TzvBJOOXwJHwxH59zZ3gFwkS5uW	1
10000043	$2a$10$h.jwJUaY1IYiUTvczEmt2.ywoTiP7VjyjIP3gV1nzpuG4uoEY2EnC	1
10000044	$2a$10$WrOpdk2kY6X/49DwcDe4ueM8pbkeeXO0zf6//5Y3ZOP6MM50AZxii	1
10000045	$2a$10$wGS8R.wKXl.MP0MdGpCtweUmGlzi2X5J6c1zr80IKK42ojK8xG5je	1
10000046	$2a$10$BbU0TiKxtkGSXGaXaUuVqetveWx73rBbXK..iWOmmv/ZmsV6ezXIe	1
10000047	$2a$10$hq3A5YJ0c2jiDCW.VbrH3eQNjscTQM/XUoB7xBmkZTnCM1vDjBzXu	1
10000048	$2a$10$v.ou29zooPfkjcx.FJqjZenprH9TeZe1zfm5hZ9ZONAAJU4Ee81xq	1
10000049	$2a$10$s4sdZ8dBZRa4jTJBe3qc.OtDPj7n3B1mCWrFZkvdbIUoZPzPTmQJS	1
10000050	$2a$10$ke0aFWbyXGK6A5LZXuQUXumBz9XRmUIzVHZl182qvpAEXeHF5PJ3e	1
10000051	$2a$10$TpP8HFCHgvHSdbXrFXlDQuwtxdZUuJIunKCM4c6ECh9JstSRHdqGG	1
10000052	$2a$10$y9CjwW9hoFqGx1/S6LL7KuXPiPM.UDBy9i3eBAFrl.JDoQ7NpQn2q	1
10000053	$2a$10$7XY9MoWhEVeOUwmsOWcQw.8H1IUyPny/DLO9xxl5D.XtR021pFktK	1
10000054	$2a$10$oi5TBzmkfQW3MxlVhtcJm.N98LKdWoF0Daec2z78Vi09FGdJgx.LC	1
10000055	$2a$10$GwJlYKetkOW7.NzmLg2cCeo03xD/7l7XKGYNlK.Q/fxx8H1dfU7pG	1
10000056	$2a$10$.53L09aH597YzqtHxUzGcezq/v6VfmC0qN8xCoSFjV8pEj6bkeyj6	1
10000057	$2a$10$qOQ4QHdcbUoMstFKyVoATenJyt0i3ctMWrWaTH7Zb08qoVvp1psG6	1
10000058	$2a$10$b6EiP0qZz1.EIuKPKibJr.bA6IeDBoD70.vmpz5BWgY/WnGxK7BgS	1
10000059	$2a$10$P7IEzidWEut66YtagaIoA.rB3GZVq0Qu568DoirYLTZtd20aYnr.m	1
10000060	$2a$10$rbXf9Nc8Kzq8M89zqDsNYOIpFcqtmCuHKbSsvMFaXia1PAjXBor6W	1
10000061	$2a$10$xDaNqbnWuFwV0.Yk9JijQ.uoGwYOwTLW3sBS/klvO3gbYyA9cccIS	1
10000062	$2a$10$GPCT5kd5bVp.H.WozkHe/OR9/iBtYOUJWDXDpFyX68QXyAbndemF.	1
10000063	$2a$10$tDVg3evtVyVkxn8RRqwal.LmFd7TksL.6rth/.IuPpBjllb7tHLSu	1
10000064	$2a$10$T4YvFO3miVr/MosrYh5ALehWGqkMVxLiNNSAyhLfbXttkl.KdXGBO	1
10000065	$2a$10$kix90YS68W1ZKR5dl32rnufnqI7NLc14/QKJfBLbsh2EQ43HL8i/a	1
10000066	$2a$10$Pvxsbg40X0UH2hwDROT2QuIiLZcrJBr5uiZpwghrpj0Zr4JUL.ceu	1
10000067	$2a$10$0EkbhvSNjDpnZXLB1Aw2CepsAqivljr/.MREwzPdSKB.HgLiaYTpq	1
10000068	$2a$10$kDh8Rk0L5vR9OZiRK8rnhe4ts8Aa9UL2biWUPxeCRoztSfKrTYwFi	1
10000069	$2a$10$g2jmXtlC/bn.wNGGazJDmu53ApQsGTWTQsER3dmh7C4ze6Nu/JkFa	1
\.


--
-- Name: entity_seq; Type: SEQUENCE SET; Schema: public; Owner: authenticationservice_user
--

SELECT pg_catalog.setval('public.entity_seq', 10000069, true);

--
-- Name: student_auth student_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: authenticationservice_user
--

ALTER TABLE ONLY public.student_auth
    ADD CONSTRAINT student_auth_pkey PRIMARY KEY (id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO authenticationservice_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO authenticationservice_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO authenticationservice_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO authenticationservice_user;


--
-- PostgreSQL database dump complete
--

