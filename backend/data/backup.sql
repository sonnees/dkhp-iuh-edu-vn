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
10000016	$2a$10$Sl8suxwHF27170VlOtPE.Oi/yzqnVxssQ51PvCaNinLtk1vs8QoqO	0
10000017	$2a$10$21o9ceY4/E7IGOrjs9W48OSUk8hogzfWBIUF5x395UqI0pJbYV4Mi	0
10000018	$2a$10$aRzs0ghMDhwjqZbG2XZdf.SJ0DO06LYjhyL3IarkNLBpM7MtwKmL6	0
10000019	$2a$10$jalcpK6Er0g9I4hMIp1lzOmGSg1s7Q4ZMhDk0DcnLeav4/NAkkc5y	0
10000020	$2a$10$Dzwo5wFOdgEgf7GpTAFyUuiUDsHJb9u/zyxDc2N2v5v56iRcbtK72	0
10000021	$2a$10$OB2kxH02ocKAanjeDFEWPufco..fMRlaX/zPJG7ThQ0JATwr0FYqm	0
10000022	$2a$10$IqphwmAHpCBUmd8ixQoEteclmoUMTVHP6NE8ILc514tSeOJa/Q8xC	0
10000023	$2a$10$GSN/blswZShnlWRpriZMGeVsG6DnuLY039eG6vigF9n68RJB3U5oa	0
10000024	$2a$10$6dp1DWu2PMC2otyW1bvYJ.tBOYyPCl0lmgPgLA5BUDYZAkOf9l3Mi	0
10000025	$2a$10$2nkFzMXiO0AVoOTaKnTx8eFqyro7FTW9aw7Esmd9kxz8YvkebxsBS	0
10000026	$2a$10$smVh3WK5ok1a9IaepZavCegjRF8sE8vg/dkxM8zqiahP20Hf/aEj2	0
10000027	$2a$10$lKR5WQ47oHYcJuGaH6Z0EO92SujAw9l2GQA9Y2hqJzzb4SssJLfzq	0
10000028	$2a$10$xckkfPUim/nKwRhhHqDAu.im745umQBYN/3WUz3GrxX3YdpQKd/mW	0
10000029	$2a$10$GsdjO7tKrcPnisehi0LNK.DJI7aNHbghwMBl6m0YHdcDZDWho2gxq	0
10000030	$2a$10$5gVcWd3qhrNb5K5nxJ1hZuZDeX5EM8YEW7XMs2.Z2Xz/k3KQ18EZu	0
10000031	$2a$10$6stD2ElgB/5QM8/GdYElcuo.z/dvU2odqLqYeKBfdPb.KHKzN7.sK	0
10000032	$2a$10$xx2Vj3GqKpkUsq11pJmIButh.TJCUYon0JCjew09G6dVtUbYEgIpW	0
10000033	$2a$10$ESX8iR.uF2MWpX0p0iG8E.5bKdICHngsFVzvbj7.cjx504GJtFMJW	0
10000034	$2a$10$8xL14fX.cN2fHIJiGxse1.xbsGxagir37tdxSCt3qK0iUwEtFxKbO	0
10000036	$2a$10$f6G4k/.EqFHhL2WNP5p/d.EyM69Ypl5QSVb2DrEmI3p74HV6e09be	0
10000035	$2a$10$9HkkDsl/pucyDixNk7L2z.gmb5EOatSNfNa2ngp9zWrqiyQ9J1Zke	0
10000037	$2a$10$fUyJJyWLcbe6HPkOJTrKqOMHsLUpIWEPuHTlvMkCarhVcIvYQADN2	0
10000038	$2a$10$EtIPQZDgmD0rHBz.prf.fuM2YktM.RukMM/uIdAfiP4vAM74Rze4G	0
10000039	$2a$10$rNyQsUsbYMpAopy8D6y9luW7mO.19GDbraW/dHAshd1tpo5zNuoAK	0
10000040	$2a$10$2DckqbDSF.HcZWkVBkKUHein8YiiEeoi2VegYLi/xzMQ6aqdnlY4C	0
10000041	$2a$10$sRatrKFVsssTPsDHncgpSeDH7uM9DCuZFo/s6ntv39NdDTKiUkMEm	0
10000042	$2a$10$Q.nVePVQv.C.bXJQ.FwdbOeeSXHZHQ.O2ycObLk9H2EQheMWpiRVK	0
10000043	$2a$10$vDBCzJbE.jICx/2FQExI/OthzFTTMqvMUcPMkGb/GIKpUb5Mn7g9K	0
\.


--
-- Name: entity_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entity_seq', 10000015, true);


--
-- Name: student_auth student_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_auth
    ADD CONSTRAINT student_auth_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

