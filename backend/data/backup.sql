--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
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
-- Name: entity_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entity_seq
    START WITH 10000000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entity_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: student_auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_auth (
    id bigint NOT NULL,
    password character varying(255),
    role smallint,
    CONSTRAINT student_auth_role_check CHECK (((role >= 0) AND (role <= 3)))
);


ALTER TABLE public.student_auth OWNER TO postgres;

--
-- Data for Name: student_auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_auth (id, password, role) FROM stdin;
10000000	$2a$10$N0oLiMRJJ7Ak9A0fHxqbdO.Bj1Q5Xnz/E2tFRP30b90SZ3/POybUK	3
10000001	$2a$10$QTxdyqGIs4zOEGU0gF9q8uEM1h76m4M/13C943Bp2EwU4vNWsL/jG	2
10000002	$2a$10$e1ZHCzFwNmaX0gy2.nR2V.LX.TNny6wnNMuGDyL8yC0wtWFupytze	2
10000003	$2a$10$hrByoQwK.noQYr1g1aE0S.su4xw7N1dj3Y6ju2e0BFiM0yUegs8rC	2
10000004	$2a$10$AYXLtYWKprj.OngiBtdsx.ZCrZF6hlv3PRQZJmLQQPSkxEzEcWYoC	2
10000005	$2a$10$.Zb1SAaGuQDqaTg6lKnrSuQiYoBmoOyNQg244hke88B8anZ.T9lHy	2
10000006	$2a$10$wWFtlmLmSsW.jAYijl8daO/8mbdZknIvaaO2pwUgl9wBmg2c7Pwbu	2
10000007	$2a$10$VfL2qHO1CazQ3FQs6PKm/OCYZ5mwYxUTHSWd2Co5NOtxPXtzwf7GO	1
10000008	$2a$10$jC5zuucaYU0LKaaFZ9zEzeRuyFvn6eoEWYHzAaNOi6BCA9/TfSeRG	1
10000009	$2a$10$WuEC79bssxGbnXkZwH2Gz.VD9rPM9fMrT8shLH8Wz0r01oPazdRAK	1
10000010	$2a$10$51.NXdcTTHDp6VjZgJEsTectLWmfhSwqWsXYsPuVwMm3s6MKR6Yyq	1
10000011	$2a$10$kQ8lX9Uo1vHnmgxDT1YVwO8Sc.amHOu7ihUh4MQW7pDX/D2KpSguC	1
10000012	$2a$10$GSVffgyQkVi03ffE7W9ddOLxtgxd.GAaGSVoG08xc2qgJa9vUyCXu	1
10000013	$2a$10$F0wwEINuouRz4Ng/f3EppeGtpkE9g29j/5lqxJCPNOLFIgRuXJcD.	1
10000014	$2a$10$JrrX.pD8fpTU/91THHypl.mF4jDUpGCNFCby8sBxy8IPBYzyxERzy	1
10000015	$2a$10$l9umLxlJmPqBk8peja.n2eLoGymF5x.oLXkAZ.Tw2yuYnY4r5SqHS	1
10000016	$2a$10$PMwQysIF7cKK/ddxjiIM/e/zUxr6K0mrdGSMOTpghohb9V2opMYim	0
10000017	$2a$10$6QFbf6F7ZdUo2J1iOfQRiuHoCxQUpQsWTRlmTyG2c7Qww9hgDzZJm	0
10000018	$2a$10$Zb8c6YPDv8pxe4JO8BK9nO5LeQdKDVGT0K6ILuzRXAGIGK3Ehhusy	0
10000019	$2a$10$Fn8Ee75DW4oU7wmyePCp..vZ15zQs2mML9rKTjwBsX1gJl1hrrMOC	0
10000020	$2a$10$azLKrhHBuIpT.kL3dnpYu.7p6wM1dWCvjEHH.2.GNG04f2jycRnPW	0
10000021	$2a$10$/qnUk1p2uGnQ07dG/LSswOyvzNKakUptV1E5ldwyZIwMdMqAC4Mqu	0
10000022	$2a$10$Hynf0OccKttSIbB0OYdfKezTIqDKW9.yYEi1wjUOQBn5z8fhJLWea	0
10000023	$2a$10$TXx1WWWN2AvuB5Lr.DUKTebb8SlDG7/.XBdyrEwZCCjwykLZDklPq	0
10000024	$2a$10$8bnP/TAKb9KGLFIMQDYC3eo./Uv47jESb.h.gS1lFkeOZN1yVqF4.	0
10000025	$2a$10$rOLbpXnQkx5xHp6U6Y3ume1DwPkiZ6Z8T67oQI2TXiYn3ThAJseRK	0
10000026	$2a$10$qMCnm9QJ67dhNHPF0qSSYuTv3nGDTmtnJsQ/0HKucNhBnxN8RSpWq	0
10000027	$2a$10$6uKC2fj2mHJTy3s8A1uRkuheHDdipURTDKhuoT541OHLKGg/sC9KO	0
10000028	$2a$10$9R08DYjSdgTRDDX9qEi4N.OMb3eClsXUnBh448y4Byn98CaPw6xd6	0
10000029	$2a$10$GjbCSN.GQhJNuSXWPoIaTeCAHf1ubVnia1Fn3jUSy8ITPwbUBDl0e	0
10000030	$2a$10$3uNc7Xfmhrs/QMzDpAnpsefKPrO0vRZVBcIM/2GgUrLmy1x.4x4ju	0
10000031	$2a$10$GQ.eNI5sJNxbZhOuKLqxk.fDh7jJO5wYSwSraa1/nESXGN8FisldO	0
10000032	$2a$10$0YK9r5J9wdHAgxSCUJs1aOI/bEqvyDFgP3MbUSIrqZygVWoDMRKLS	0
10000033	$2a$10$/LOW5hz//buSTjISzlUCT.J2gQvnIYJ9kty9xhNcy8t7JH7Y8uqZe	0
10000034	$2a$10$nPYGS4S96HnuUrHEDuw8j.8/sbiEmA6GYF6R.csr2xY4vRytX1p9S	0
10000035	$2a$10$Z166G0LRMsGoFpi9avVuzOSwKZZNd2INCgKQer.KQv0iIK.ZtTVu2	0
10000036	$2a$10$aYd/Hfm4bdopoG2K5EtvwuhMahOmlP1GK7s81wmuDaGY7t6E9Bbny	0
10000037	$2a$10$gkzA3A20CP7ai7eDN.jLj.fBgAWq/N1CjXVxuqBHrEMb7CRMWY4eC	0
10000038	$2a$10$TKIa6s0HbY.m00RBJlxDVu4W6oT8wGx8fMxaiWhvV2it.2SeZUyPK	0
10000039	$2a$10$v5S6tuM5/kNOWWprvwXV2uj5zOE7rWPinxzwemLPXwQb8wHxmadke	0
10000040	$2a$10$MvoguXACChSccmdY67WYQ.RvVk/JJHm4putdyGg6dTcLjuCkxguQS	0
10000041	$2a$10$t0Z4nMXoJOhByQmkDnue/.JrTpFG2YG2kE3H4ltGpaEywwJXzrNC2	0
10000042	$2a$10$zPaGkxzk0QpOnU0skLE1vOjulpSfXG8djNUjsUlrM459uBw7Ie33a	0
10000043	$2a$10$1cuRN0fZ7mn8Ec0KActa7e8DVUzTnPEONmJ5EkcRLzJtwDJyGsYdu	0
\.


--
-- Name: entity_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entity_seq', 10000043, true);


--
-- Name: student_auth student_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_auth
    ADD CONSTRAINT student_auth_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

