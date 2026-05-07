import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, BarChart2, Globe, DollarSign,
  ChevronDown, ChevronUp, Search, Star, Cpu, ShoppingBag,
  Car, Cloud, Smartphone, Film, Database, Shield, Zap,
  Building2, BookOpen, HelpCircle, CheckCircle2, AlertCircle,
  ArrowRight, Play, Info, LineChart, PieChart, Activity
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, LineChart as ReLineChart, Line
} from "recharts";

// ─── Stock Data ──────────────────────────────────────────────────────────────
const STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    industry: "Consumer Electronics / Software",
    sector: "Technology",
    hq: "Cupertino, California",
    founded: 1976,
    employees: "161,000+",
    color: "#6e6e73",
    gradient: "from-gray-700 to-gray-900",
    badge: "bg-gray-100 text-gray-700",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/195px-Apple_logo_black.svg.png",
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories — plus services including the App Store, Apple Music, and iCloud.",
    revenue: "$383B (FY2023)",
    products: ["iPhone", "Mac", "iPad", "Apple Watch", "AirPods", "Services (iCloud, App Store)"],
    highlights: ["Over 2.2 billion active devices", "#1 smartphone brand by revenue", "Services segment growing 16% YoY", "Largest company by market cap"],
    risk: "Low-Medium",
    marketCap: "$3.3T",
    peRatio: "29x",
    divYield: "0.5%",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    industry: "Software / Cloud Computing",
    sector: "Technology",
    hq: "Redmond, Washington",
    founded: 1975,
    employees: "221,000+",
    color: "#00a1f1",
    gradient: "from-blue-500 to-blue-700",
    badge: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
    description: "Microsoft is a global leader in software (Windows, Office), cloud computing (Azure), gaming (Xbox), and enterprise services — including a major stake in OpenAI.",
    revenue: "$211B (FY2023)",
    products: ["Azure", "Microsoft 365", "Windows", "Xbox", "GitHub", "LinkedIn", "OpenAI partnership"],
    highlights: ["Azure is 2nd largest cloud platform", "AI integration across all products", "GitHub: 100M+ developers", "Teams: 320M monthly active users"],
    risk: "Low",
    marketCap: "$3.1T",
    peRatio: "35x",
    divYield: "0.7%",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    industry: "Semiconductors / AI Computing",
    sector: "Technology",
    hq: "Santa Clara, California",
    founded: 1993,
    employees: "29,000+",
    color: "#76b900",
    gradient: "from-green-500 to-green-700",
    badge: "bg-green-100 text-green-700",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/NVIDIA_Corporation_logo.png/220px-NVIDIA_Corporation_logo.png",
    description: "NVIDIA designs GPU chips and AI computing platforms. Its H100 and Blackwell chips power the world's largest data centers, AI training, and autonomous vehicle research.",
    revenue: "$60B (FY2024)",
    products: ["H100/H200 GPUs", "Blackwell Platform", "CUDA Software", "GeForce (Gaming)", "DRIVE (Automotive)", "Omniverse"],
    highlights: ["Dominates 80%+ of AI chip market", "Revenue grew 120% YoY", "Powers ChatGPT, Gemini, Llama training", "Partnered with every major cloud provider"],
    risk: "High",
    marketCap: "$2.8T",
    peRatio: "40x",
    divYield: "0.03%",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    industry: "E-Commerce / Cloud / Logistics",
    sector: "Consumer Discretionary / Technology",
    hq: "Seattle, Washington",
    founded: 1994,
    employees: "1,500,000+",
    color: "#ff9900",
    gradient: "from-orange-400 to-orange-600",
    badge: "bg-orange-100 text-orange-700",
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png",
    description: "Amazon is the world's largest online retailer and cloud computing provider (AWS). It spans e-commerce, logistics, streaming (Prime Video), smart home (Alexa), and digital advertising.",
    revenue: "$574B (FY2023)",
    products: ["AWS", "Amazon.com Marketplace", "Prime", "Alexa / Echo", "Prime Video", "AWS AI Services"],
    highlights: ["AWS holds ~32% global cloud market share", "Prime: 200M+ paid members", "Largest employer in the US", "Advertising revenue: $47B"],
    risk: "Low-Medium",
    marketCap: "$2.0T",
    peRatio: "45x",
    divYield: "0%",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc. (Google)",
    industry: "Internet / Advertising / AI",
    sector: "Communication Services",
    hq: "Mountain View, California",
    founded: 1998,
    employees: "182,000+",
    color: "#4285f4",
    gradient: "from-blue-400 to-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png",
    description: "Alphabet (Google) dominates search, digital advertising, Android, YouTube, and cloud services. Its DeepMind and Gemini AI compete directly with OpenAI.",
    revenue: "$307B (FY2023)",
    products: ["Google Search", "YouTube", "Android", "Google Cloud", "Gemini AI", "Waymo (Self-driving)"],
    highlights: ["91% global search market share", "YouTube: 2.7B monthly users", "Gemini AI powering Google Workspace", "Waymo leads autonomous driving"],
    risk: "Low-Medium",
    marketCap: "$2.1T",
    peRatio: "25x",
    divYield: "0.5%",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    industry: "Social Media / VR / Advertising",
    sector: "Communication Services",
    hq: "Menlo Park, California",
    founded: 2004,
    employees: "67,000+",
    color: "#0866ff",
    gradient: "from-blue-500 to-violet-600",
    badge: "bg-violet-100 text-violet-700",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/512px-Meta_Platforms_Inc._logo.svg.png",
    description: "Meta owns Facebook, Instagram, WhatsApp, and Threads. It is aggressively investing in AI (Llama models) and the metaverse through its Reality Labs VR/AR division.",
    revenue: "$134B (FY2023)",
    products: ["Facebook", "Instagram", "WhatsApp", "Threads", "Meta Quest VR", "Llama AI"],
    highlights: ["3.2B daily active users across apps", "Llama 3 is top open-source AI", "AI-powered ad revenue surging", "Ray-Ban Meta smart glasses launched"],
    risk: "Medium",
    marketCap: "$1.4T",
    peRatio: "26x",
    divYield: "0.4%",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    industry: "Electric Vehicles / Energy / AI",
    sector: "Consumer Discretionary",
    hq: "Austin, Texas",
    founded: 2003,
    employees: "127,000+",
    color: "#cc0000",
    gradient: "from-red-500 to-red-700",
    badge: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/240px-Tesla_logo.png",
    description: "Tesla is the world's leading EV manufacturer. It also develops autonomous driving (Full Self-Driving), energy storage (Powerwall, Megapack), and Optimus humanoid robots.",
    revenue: "$97B (FY2023)",
    products: ["Model S/3/X/Y", "Cybertruck", "Full Self-Driving (FSD)", "Powerwall", "Megapack", "Optimus Robot"],
    highlights: ["#1 EV brand globally", "FSD Beta: 1M+ users", "Supercharger network: 50,000+ stations", "Optimus robot production starting"],
    risk: "High",
    marketCap: "$800B",
    peRatio: "55x",
    divYield: "0%",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    industry: "Semiconductors / CPUs & GPUs",
    sector: "Technology",
    hq: "Santa Clara, California",
    founded: 1969,
    employees: "26,000+",
    color: "#ed1c24",
    gradient: "from-red-500 to-orange-500",
    badge: "bg-red-100 text-red-600",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/320px-AMD_Logo.svg.png",
    description: "AMD designs high-performance CPUs (Ryzen) and GPUs (Radeon, Instinct MI300) for PCs, gaming, data centers, and AI workloads — a strong NVIDIA competitor.",
    revenue: "$22.7B (FY2023)",
    products: ["Ryzen CPUs", "EPYC Server CPUs", "Radeon GPUs", "Instinct MI300 AI Chips", "Xbox/PS5 Custom Chips"],
    highlights: ["MI300X rivals NVIDIA H100 in memory", "Powers Xbox Series X and PS5", "EPYC gaining data center share", "AI chip orders from Microsoft, Meta"],
    risk: "High",
    marketCap: "$240B",
    peRatio: "42x",
    divYield: "0%",
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    industry: "Semiconductors / CPU Manufacturing",
    sector: "Technology",
    hq: "Santa Clara, California",
    founded: 1968,
    employees: "124,000+",
    color: "#0068b5",
    gradient: "from-blue-600 to-blue-800",
    badge: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1555617778-02518510b9bf?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2023.svg/480px-Intel_logo_2023.svg.png",
    description: "Intel is the world's largest semiconductor company by revenue, making CPUs for PCs, servers, and data centers. It is investing heavily in AI PCs and domestic chip manufacturing (Intel Foundry).",
    revenue: "$54B (FY2023)",
    products: ["Core Ultra CPUs", "Xeon Server CPUs", "Gaudi AI Accelerators", "Intel Foundry Services", "Arc GPUs"],
    highlights: ["Chips in 80%+ of laptops worldwide", "Intel Foundry 18A process competing with TSMC", "US CHIPS Act subsidy recipient", "Gaudi 3 targeting AI training market"],
    risk: "Medium-High",
    marketCap: "$90B",
    peRatio: "N/A",
    divYield: "1.5%",
  },
  {
    symbol: "SNDK",
    name: "SanDisk (WDC)",
    industry: "Flash Storage / NAND",
    sector: "Technology",
    hq: "San Jose, California",
    founded: 1988,
    employees: "65,000+",
    color: "#e4000f",
    gradient: "from-red-600 to-rose-700",
    badge: "bg-rose-100 text-rose-700",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Western_Digital_logo.svg/320px-Western_Digital_logo.svg.png",
    description: "SanDisk (Western Digital brand) produces flash memory (NAND), SSDs, and HDD storage. It powers data centers, consumer electronics, and AI infrastructure storage needs.",
    revenue: "$12B (FY2023)",
    products: ["SanDisk SSDs", "WD NAS Drives", "NAND Flash", "Enterprise Storage", "iNAND (Smartphone storage)"],
    highlights: ["One of world's largest NAND producers", "AI drives explosive storage demand", "Samsung and Micron competitor", "Spinning off NAND business"],
    risk: "High",
    marketCap: "$18B",
    peRatio: "N/A",
    divYield: "0%",
  },
  {
    symbol: "MU",
    name: "Micron Technology",
    industry: "Memory Semiconductors (DRAM/NAND)",
    sector: "Technology",
    hq: "Boise, Idaho",
    founded: 1978,
    employees: "48,000+",
    color: "#00a3e0",
    gradient: "from-cyan-500 to-blue-600",
    badge: "bg-cyan-100 text-cyan-700",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Micron_Technology_logo.svg/320px-Micron_Technology_logo.svg.png",
    description: "Micron is a global leader in DRAM and NAND flash memory. Its HBM3E chips are used in NVIDIA AI accelerators, making it a key AI infrastructure supplier.",
    revenue: "$22.6B (FY2024)",
    products: ["DRAM", "HBM3E (AI memory)", "NAND Flash", "Compute Express Link", "Automotive Memory"],
    highlights: ["HBM3E exclusively in NVIDIA H200", "AI memory demand surging", "CHIPS Act: $6.1B in US grants", "Revenue up 93% YoY in Q3 2024"],
    risk: "High",
    marketCap: "$105B",
    peRatio: "15x",
    divYield: "0.5%",
  },
  {
    symbol: "MSTR",
    name: "MicroStrategy (Strategy)",
    industry: "Business Intelligence / Bitcoin Treasury",
    sector: "Technology / Crypto",
    hq: "Tysons Corner, Virginia",
    founded: 1989,
    employees: "1,000+",
    color: "#f7931a",
    gradient: "from-orange-400 to-yellow-500",
    badge: "bg-yellow-100 text-yellow-700",
    image: "https://images.unsplash.com/photo-1641580529081-6cf1d09ef38c?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/MicroStrategy_logo.svg/320px-MicroStrategy_logo.svg.png",
    description: "MicroStrategy (rebranded Strategy) is the world's largest corporate Bitcoin holder with over 214,000 BTC on its balance sheet, using it as a primary treasury reserve asset.",
    revenue: "$496M (FY2023)",
    products: ["MicroStrategy ONE (BI Platform)", "Bitcoin Treasury Strategy", "AI-powered Analytics"],
    highlights: ["214,000+ BTC held (~$14B+)", "Pure-play Bitcoin exposure in stock form", "Elon Musk / Michael Saylor alignment", "Stock acts as leveraged BTC proxy"],
    risk: "Very High",
    marketCap: "$32B",
    peRatio: "N/A",
    divYield: "0%",
  },
  {
    symbol: "PLTR",
    name: "Palantir Technologies",
    industry: "AI / Defense Data Analytics",
    sector: "Technology",
    hq: "Denver, Colorado",
    founded: 2003,
    employees: "3,800+",
    color: "#7b2d8b",
    gradient: "from-purple-600 to-indigo-700",
    badge: "bg-purple-100 text-purple-700",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Palantir_Technologies_logo.svg/320px-Palantir_Technologies_logo.svg.png",
    description: "Palantir builds AI-powered data analytics platforms for the US Government (military, intelligence) and commercial enterprises. Its AIP platform lets companies deploy AI on their own data.",
    revenue: "$2.23B (FY2023)",
    products: ["Palantir Gotham (Gov)", "Palantir Foundry (Enterprise)", "AIP (AI Platform)", "MetaConstellation (Defense)"],
    highlights: ["US Army, CIA, FBI core contractor", "AIP: 100+ enterprise bootcamps/month", "S&P 500 inclusion in 2024", "Commercial revenue growing 55% YoY"],
    risk: "High",
    marketCap: "$90B",
    peRatio: "90x",
    divYield: "0%",
  },
  {
    symbol: "HOOD",
    name: "Robinhood Markets",
    industry: "Fintech / Retail Brokerage",
    sector: "Financials",
    hq: "Menlo Park, California",
    founded: 2013,
    employees: "3,800+",
    color: "#00c805",
    gradient: "from-green-400 to-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Robinhood_Logo.svg/320px-Robinhood_Logo.svg.png",
    description: "Robinhood democratized investing by offering commission-free stock, ETF, crypto, and options trading. Its app is used by 23M+ funded accounts, mostly millennials and Gen Z.",
    revenue: "$1.86B (FY2023)",
    products: ["Robinhood Stocks & ETFs", "Robinhood Crypto", "Robinhood Gold ($5/mo)", "IRA Accounts", "Robinhood Futures"],
    highlights: ["23M+ funded accounts", "First broker to offer 24/5 trading", "Gold subscription growing", "Expanding into prediction markets"],
    risk: "High",
    marketCap: "$22B",
    peRatio: "30x",
    divYield: "0%",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    industry: "Streaming / Entertainment",
    sector: "Communication Services",
    hq: "Los Gatos, California",
    founded: 1997,
    employees: "13,000+",
    color: "#e50914",
    gradient: "from-red-600 to-red-800",
    badge: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/440px-Netflix_2015_logo.svg.png",
    description: "Netflix is the world's leading streaming service with 270M+ subscribers in 190 countries. It produces original content (Stranger Things, Squid Game) and is expanding into gaming and live events.",
    revenue: "$33.7B (FY2023)",
    products: ["Netflix Streaming", "Netflix Gaming", "Ad-supported Plan", "Live Events (Netflix Live)", "Original Content"],
    highlights: ["270M+ paid subscribers globally", "Password sharing crackdown added 15M users", "Ads tier revenue growing rapidly", "Live sports rights (WWE, FIFA) secured"],
    risk: "Medium",
    marketCap: "$420B",
    peRatio: "40x",
    divYield: "0%",
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation",
    industry: "Cloud Database / Enterprise Software",
    sector: "Technology",
    hq: "Austin, Texas",
    founded: 1977,
    employees: "164,000+",
    color: "#f80000",
    gradient: "from-red-500 to-red-700",
    badge: "bg-red-100 text-red-600",
    image: "https://images.unsplash.com/photo-1558346547-abe85ef9fbc9?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/320px-Oracle_logo.svg.png",
    description: "Oracle is a global leader in cloud databases, enterprise applications (ERP, CRM), and AI infrastructure. Its OCI cloud platform hosts massive AI training clusters for major tech companies.",
    revenue: "$52.6B (FY2024)",
    products: ["Oracle Database", "Oracle Cloud Infrastructure (OCI)", "Oracle Fusion ERP", "NetSuite", "Oracle Health"],
    highlights: ["OCI hosting Microsoft AI workloads", "AI demand driving cloud growth 22% YoY", "Oracle Health powers 40% of US hospitals", "Autonomous Database leader"],
    risk: "Medium",
    marketCap: "$430B",
    peRatio: "32x",
    divYield: "1.2%",
  },
  {
    symbol: "COIN",
    name: "Coinbase Global",
    industry: "Crypto Exchange / Fintech",
    sector: "Financials / Crypto",
    hq: "San Francisco, California",
    founded: 2012,
    employees: "3,400+",
    color: "#0052ff",
    gradient: "from-blue-500 to-blue-700",
    badge: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24x_Icon_Coinbase.svg/480px-24x_Icon_Coinbase.svg.png",
    description: "Coinbase is the largest US crypto exchange. It powers crypto trading for 110M+ verified users and acts as custodian for major Bitcoin ETFs (BlackRock, Fidelity).",
    revenue: "$3.1B (FY2023)",
    products: ["Coinbase Exchange", "Coinbase Wallet", "Coinbase Prime (Institutional)", "Base (L2 Blockchain)", "USDC Stablecoin"],
    highlights: ["110M+ verified users", "ETF custodian for BlackRock, Fidelity", "Base L2: 100M+ transactions/day", "Regulatory clarity under new US policy"],
    risk: "Very High",
    marketCap: "$65B",
    peRatio: "30x",
    divYield: "0%",
  },
  {
    symbol: "BABA",
    name: "Alibaba Group",
    industry: "E-Commerce / Cloud / Fintech",
    sector: "Consumer Discretionary / Technology",
    hq: "Hangzhou, China",
    founded: 1999,
    employees: "220,000+",
    color: "#ff6a00",
    gradient: "from-orange-500 to-red-500",
    badge: "bg-orange-100 text-orange-700",
    image: "https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Alibaba_Group_logo.svg/320px-Alibaba_Group_logo.svg.png",
    description: "Alibaba is China's largest e-commerce and cloud computing conglomerate. It operates Taobao, Tmall, Alibaba.com, AliCloud, and Ant Financial (Alipay).",
    revenue: "$130B (FY2024)",
    products: ["Taobao / Tmall", "Alibaba.com (B2B)", "AliCloud", "Ant Group / Alipay", "Cainiao Logistics", "Qwen AI"],
    highlights: ["#1 e-commerce in China", "AliCloud: largest cloud in Asia", "Qwen AI competing with GPT-4", "Deep discount vs US peers (value play)"],
    risk: "High",
    marketCap: "$220B",
    peRatio: "14x",
    divYield: "1.5%",
  },
  {
    symbol: "OPENAI",
    name: "OpenAI (Tokenized)",
    industry: "Artificial General Intelligence",
    sector: "Technology / AI",
    hq: "San Francisco, California",
    founded: 2015,
    employees: "3,000+",
    color: "#10a37f",
    gradient: "from-emerald-500 to-teal-600",
    badge: "bg-teal-100 text-teal-700",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/320px-OpenAI_Logo.svg.png",
    description: "OpenAI is the creator of ChatGPT and GPT-4, the world's most widely used AI models. It generates revenue from API subscriptions, ChatGPT Plus, and enterprise licensing.",
    revenue: "$1.6B+ ARR (2023)",
    products: ["ChatGPT", "GPT-4 / GPT-4o", "OpenAI API", "Sora (Video AI)", "DALL·E", "Operator AI agents"],
    highlights: ["180M+ ChatGPT users", "Valued at $80B+", "Microsoft's strategic partner", "Sora and agent technologies leading market"],
    risk: "Very High",
    marketCap: "Private / Tokenized",
    peRatio: "N/A",
    divYield: "0%",
  },
  {
    symbol: "CRWV",
    name: "CoreWeave Inc.",
    industry: "AI Cloud Infrastructure / GPU Rentals",
    sector: "Technology / Cloud",
    hq: "Roseland, New Jersey",
    founded: 2017,
    employees: "1,000+",
    color: "#6c47ff",
    gradient: "from-violet-500 to-purple-700",
    badge: "bg-violet-100 text-violet-700",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&q=80",
    description: "CoreWeave is a specialized AI cloud provider that rents NVIDIA GPU clusters to AI startups and enterprises. It IPO'd in 2025 and is backed by NVIDIA and Microsoft.",
    revenue: "$1.9B (2024)",
    products: ["GPU Cloud Clusters", "Kubernetes for AI", "ML Training Infrastructure", "Inference Endpoints"],
    highlights: ["Backed by NVIDIA, Microsoft", "IPO'd at $40B valuation in 2025", "Microsoft signed $10B+ contract", "Alternative to AWS/GCP for AI"],
    risk: "Very High",
    marketCap: "$23B",
    peRatio: "N/A",
    divYield: "0%",
  },
];

// ─── Sector data for chart ───────────────────────────────────────────────────
const SECTOR_DATA = [
  { sector: "Technology", count: 12, color: "#6366f1" },
  { sector: "Communication", count: 3, color: "#06b6d4" },
  { sector: "Consumer Disc.", count: 2, color: "#f59e0b" },
  { sector: "Financials", count: 2, color: "#10b981" },
  { sector: "Fintech/Crypto", count: 1, color: "#f97316" },
];

const MARKET_CAP_DATA = [
  { name: "AAPL", cap: 3300 },
  { name: "MSFT", cap: 3100 },
  { name: "NVDA", cap: 2800 },
  { name: "AMZN", cap: 2000 },
  { name: "GOOGL", cap: 2100 },
  { name: "META", cap: 1400 },
  { name: "TSLA", cap: 800 },
  { name: "NFLX", cap: 420 },
  { name: "ORCL", cap: 430 },
  { name: "AMD", cap: 240 },
];

const REVENUE_TREND = [
  { year: "2020", aapl: 274, msft: 143, nvda: 17, amzn: 386 },
  { year: "2021", aapl: 365, msft: 168, nvda: 27, amzn: 470 },
  { year: "2022", aapl: 394, msft: 198, nvda: 27, amzn: 514 },
  { year: "2023", aapl: 383, msft: 211, nvda: 60, amzn: 574 },
];

const RISK_RADAR = [
  { metric: "Market Cap", value: 90 },
  { metric: "Revenue Growth", value: 75 },
  { metric: "Profitability", value: 80 },
  { metric: "Innovation", value: 95 },
  { metric: "Dividend", value: 30 },
  { metric: "Volatility", value: 60 },
];

// ─── Q&A Data ────────────────────────────────────────────────────────────────
const QA = [
  {
    q: "What is a tokenized US stock?",
    a: "Tokenized stocks are digital tokens that represent fractional ownership or price exposure to real US-listed shares. On EVE FINANCE, you trade price-tracking tokens — enabling 24/7 trading without needing a US brokerage account.",
  },
  {
    q: "What are market orders vs limit orders?",
    a: "A market order executes immediately at the current price. A limit order lets you set a target price — a buy limit executes only when the market price drops to your target, and a sell limit executes when the price rises to your target. Funds are frozen until execution or cancellation.",
  },
  {
    q: "How is the stock price determined?",
    a: "Prices are sourced in real-time from CoinMarketCap Pro (institutional-grade data). Prices refresh every 30 seconds during market hours and may show last-close prices on weekends.",
  },
  {
    q: "What fees apply to stock trading?",
    a: "EVE FINANCE charges a 0.1% fee on all stock trades. This is significantly lower than most traditional brokers. You also earn EVE token rewards equal to 10× the fee amount on every trade.",
  },
  {
    q: "Can I hold fractional shares?",
    a: "Yes. You can buy any dollar amount — even $10 worth of AAPL. Your holdings are stored as decimal quantities with 6 decimal places of precision.",
  },
  {
    q: "What happens to my pending limit orders?",
    a: "Pending orders freeze your funds (USDT for buys, shares for sells). The backend checks prices every 5 minutes and executes automatically when conditions are met. You can cancel or modify the limit price at any time from the US Stocks page.",
  },
  {
    q: "What currency do I use to buy stocks?",
    a: "You can buy stocks using USDT or USD in your wallet. For sells, proceeds are credited back to USDT. Make sure to deposit first and maintain sufficient balance.",
  },
  {
    q: "Is trading available 24/7?",
    a: "You can place orders 24/7. However, US stock markets are only open Monday–Friday, 9:30 AM – 4:00 PM Eastern Time (9:30 PM – 4:00 AM Singapore time). Limit orders placed outside hours queue for next open.",
  },
  {
    q: "Why do some stocks show high risk?",
    a: "High-risk stocks (NVDA, TSLA, MSTR, COIN, OPENAI, CRWV) experience greater price swings, may not pay dividends, and their valuations depend heavily on future growth expectations. They offer higher potential returns but can lose significant value quickly.",
  },
  {
    q: "What is the EVE token reward?",
    a: "Every time you trade stocks, you earn EVE tokens as a reward. The reward equals 100× the fee paid in USD value. EVE tokens can be used within the platform and traded.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseFloat(value);
    const duration = 1500;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function SectorChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={SECTOR_DATA} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis dataKey="sector" type="category" tick={{ fontSize: 11 }} width={100} />
        <Tooltip />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {SECTOR_DATA.map((entry, i) => (
            <rect key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MarketCapChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={MARKET_CAP_DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="B" />
        <Tooltip formatter={(v) => [`$${v}B`, "Market Cap"]} />
        <Bar dataKey="cap" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={REVENUE_TREND}>
        <defs>
          <linearGradient id="gAAPL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6e6e73" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6e6e73" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gMSFT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00a1f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00a1f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gNVDA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#76b900" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#76b900" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gAMZN" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9900" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ff9900" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="B" />
        <Tooltip formatter={(v) => [`$${v}B`, ""]} />
        <Area type="monotone" dataKey="aapl" name="AAPL" stroke="#6e6e73" fill="url(#gAAPL)" strokeWidth={2} />
        <Area type="monotone" dataKey="msft" name="MSFT" stroke="#00a1f1" fill="url(#gMSFT)" strokeWidth={2} />
        <Area type="monotone" dataKey="nvda" name="NVDA" stroke="#76b900" fill="url(#gNVDA)" strokeWidth={2} />
        <Area type="monotone" dataKey="amzn" name="AMZN" stroke="#ff9900" fill="url(#gAMZN)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RiskRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={RISK_RADAR}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
        <Radar name="US Tech" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function StockCard({ stock, onClick }) {
  const riskColor = {
    "Low": "bg-green-100 text-green-700",
    "Low-Medium": "bg-green-100 text-green-600",
    "Medium": "bg-yellow-100 text-yellow-700",
    "Medium-High": "bg-orange-100 text-orange-700",
    "High": "bg-red-100 text-red-600",
    "Very High": "bg-red-200 text-red-700",
  }[stock.risk] || "bg-slate-100 text-slate-600";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => onClick(stock)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all h-full">
        <div className="relative h-36 overflow-hidden">
          <img
            src={stock.image}
            alt={stock.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${stock.gradient} opacity-70`} />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-bold text-sm">
              {stock.symbol}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm leading-tight">{stock.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{stock.industry}</p>
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">{stock.marketCap}</span>
            <Badge className={`text-xs px-1.5 ${riskColor}`}>{stock.risk}</Badge>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{stock.description.slice(0, 100)}…</p>
          <Button variant="ghost" size="sm" className="w-full mt-2 h-7 text-xs text-blue-600 hover:text-blue-700 gap-1">
            Learn More <ArrowRight className="w-3 h-3" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StockDetail({ stock, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Hero image */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          <img src={stock.image} alt={stock.name} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${stock.gradient} opacity-75`} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40">✕</button>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-3 mb-1">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-bold">{stock.symbol}</Badge>
              <Badge className={`text-xs ${stock.badge}`}>{stock.sector}</Badge>
            </div>
            <h2 className="text-white font-bold text-2xl">{stock.name}</h2>
            <p className="text-white/80 text-sm">{stock.industry}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Market Cap", value: stock.marketCap },
              { label: "P/E Ratio", value: stock.peRatio },
              { label: "Div. Yield", value: stock.divYield },
              { label: "Risk Level", value: stock.risk },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="font-bold text-slate-900 text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> About</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{stock.description}</p>
          </div>

          {/* Revenue */}
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-green-600 font-medium mb-1">Annual Revenue</p>
            <p className="font-bold text-green-800">{stock.revenue}</p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Key Products & Services</h3>
            <div className="flex flex-wrap gap-2">
              {stock.products.map((p, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg">{p}</span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Key Highlights</h3>
            <div className="space-y-2">
              {stock.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-3 gap-3 text-xs text-center text-slate-500 border-t pt-4">
            <div><p className="font-medium text-slate-700">HQ</p><p>{stock.hq.split(",")[0]}</p></div>
            <div><p className="font-medium text-slate-700">Founded</p><p>{stock.founded}</p></div>
            <div><p className="font-medium text-slate-700">Employees</p><p>{stock.employees}</p></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QASection() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {QA.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-slate-800 text-sm pr-4">{item.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function USStocksGuide() {
  const [activeTab, setActiveTab] = useState("intro");
  const [searchQ, setSearchQ] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStock, setSelectedStock] = useState(null);

  const sectors = ["All", "Technology", "Communication Services", "Consumer Discretionary / Technology", "Financials", "Technology / Crypto", "Technology / AI", "Technology / Cloud", "Financials / Crypto"];
  const sectorShort = ["全部", "科技", "媒体", "消费", "金融", "加密货币", "人工智能", "云计算", "加密金融"];

  const filteredStocks = STOCKS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      s.symbol.toLowerCase().includes(searchQ.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchQ.toLowerCase());
    const matchSector = selectedSector === "全部" || selectedSector === "All" || s.sector.includes(selectedSector.replace("-", "/"));
    return matchSearch && matchSector;
  });

  const tabs = [
    { id: "intro", label: "美股入门", icon: BookOpen },
    { id: "stocks", label: "股票大全", icon: BarChart2 },
    { id: "charts", label: "市场分析", icon: LineChart },
    { id: "qa", label: "常见问题", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Tab nav */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── INTRO ── */}
      {activeTab === "intro" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden h-64">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
              className="w-full h-full object-cover"
              alt="NYSE"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/60" />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <Badge className="bg-blue-500/80 text-white border-0 w-fit mb-3">EVE FINANCE · 美股交易</Badge>
              <h2 className="text-3xl font-bold text-white mb-2">投资美国最优质企业</h2>
              <p className="text-blue-100 max-w-lg text-sm">
                交易 20 只热门美股通证化份额 —— Apple、NVIDIA、Tesla、OpenAI 等，最低$10 起投，7×24 小时，全球随时随地交易。
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "可交易股票", val: 20, suffix: "只", icon: BarChart2, color: "from-blue-500 to-indigo-600" },
              { label: "总市值", val: 18, suffix: "T+", prefix: "$", icon: DollarSign, color: "from-green-500 to-emerald-600" },
              { label: "最低投资", val: 10, suffix: "", prefix: "$", icon: TrendingUp, color: "from-orange-400 to-red-500" },
              { label: "交易费率", val: 0.1, suffix: "%", icon: Activity, color: "from-purple-500 to-violet-600" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`bg-gradient-to-br ${stat.color} border-0 text-white`}>
                  <CardContent className="p-4">
                    <stat.icon className="w-5 h-5 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">
                      <AnimatedCounter value={stat.val} suffix={stat.suffix} prefix={stat.prefix || ""} />
                    </p>
                    <p className="text-xs opacity-80 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* What are stocks */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-blue-600" /> 什么是股票？
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p><strong className="text-slate-800">股票</strong>（也称为<em>股份</em>或<em>股权</em>）代表公司所有权的一个单位。当您购买 Apple 股票时，您就成为 Apple Inc. 的部分所有者。</p>
                <p>公司在<strong className="text-slate-800">证券交易所</strong>（如纽约证券交易所或纳斯达克）发行股票以筹集资金用于发展。作为回报，投资者通过<strong>股价上涨</strong>和有时<strong>股息分红</strong>分享公司利润。</p>
                <p>在 EVE FINANCE，您交易的是<strong>通证化股票</strong>—— 数字化代表，追踪真实股票价格，让您无需美国券商账户即可 fully 参与市场。</p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80"
                  className="rounded-xl w-full h-48 object-cover"
                  alt="Trading"
                />
              </div>
            </CardContent>
          </Card>

          {/* How to trade */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="w-5 h-5 text-green-600" /> 如何在 EVE FINANCE 交易美股
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { step: "1", title: "存入 USDT 或 USD", desc: "使用银行转账或 USDT（ERC20/TRC20/SOL）为钱包充值。最低存款$50。" },
                    { step: "2", title: "进入美股页面", desc: "从侧边栏导航到美股页面。浏览实时价格。" },
                    { step: "3", title: "选择股票和订单类型", desc: "选择市价单立即成交，或限价单设定目标价格。" },
                    { step: "4", title: "输入金额并确认", desc: "输入要花费的 USDT 金额。查看手续费和预估股数。确认交易。" },
                    { step: "5", title: "跟踪持仓", desc: "您的股份立即显示在持仓中。盈亏随实时价格更新。" },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <img
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&q=80"
                    className="rounded-xl w-full h-40 object-cover"
                    alt="Stock trading app"
                  />
                  {/* Order types */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-green-700 font-semibold text-xs mb-1">市价单</p>
                      <p className="text-green-600 text-xs">按当前市价立即成交。适合快速建仓。</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-blue-700 font-semibold text-xs mb-1">限价单</p>
                      <p className="text-blue-600 text-xs">设定目标价格。资金冻结直至价格触达或取消。</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sectors overview */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="w-5 h-5 text-purple-600" /> 可以投资哪些行业？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    { icon: Cpu, label: "科技", desc: "半导体、软件、云计算 — AAPL, MSFT, NVDA, AMD, INTC", color: "text-indigo-600 bg-indigo-50" },
                    { icon: Globe, label: "通信服务", desc: "广告、社交、流媒体 — GOOGL, META, NFLX", color: "text-cyan-600 bg-cyan-50" },
                    { icon: ShoppingBag, label: "消费/电商", desc: "零售与物流 — AMZN, BABA", color: "text-amber-600 bg-amber-50" },
                    { icon: Building2, label: "金融科技与加密货币", desc: "券商、交易所 — HOOD, COIN, MSTR", color: "text-emerald-600 bg-emerald-50" },
                    { icon: Zap, label: "AI 基础设施", desc: "纯 AI 公司 — OPENAI, CRWV, PLTR", color: "text-violet-600 bg-violet-50" },
                    { icon: Car, label: "电动车与能源", desc: "电动汽车、自动驾驶 — TSLA", color: "text-red-600 bg-red-50" },
                  ].map((s, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${s.color}`}>
                      <s.icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">{s.label}</p>
                        <p className="text-xs opacity-80">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                    className="rounded-xl w-full h-48 object-cover mb-3"
                    alt="Sectors"
                  />
                  <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl p-4 text-white">
                    <p className="text-sm font-semibold mb-1">💡 分散投资提示</p>
                    <p className="text-xs text-blue-100">跨行业分散投资可降低风险。当科技股下跌时，消费股可能保持稳定。</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk types */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-orange-500" /> 理解风险等级
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { level: "低/中低", stocks: "AAPL, MSFT, AMZN, GOOGL", desc: "成熟盈利公司，收入多元化，数十年历史。适合长期持有。", color: "border-green-300 bg-green-50", badge: "bg-green-100 text-green-700" },
                  { level: "中/中高", stocks: "META, INTC, MU, NFLX, ORCL, BABA, AMD", desc: "实力强劲公司，有真实收入但增长预期较高或周期性敞口。中等波动。", color: "border-yellow-300 bg-yellow-50", badge: "bg-yellow-100 text-yellow-700" },
                  { level: "非常高", stocks: "NVDA, TSLA, MSTR, COIN, OPENAI, CRWV, PLTR", desc: "投机性或早期成长公司。上涨潜力大但下跌可能超 50%。", color: "border-red-300 bg-red-50", badge: "bg-red-100 text-red-700" },
                ].map((r, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${r.color}`}>
                    <Badge className={`text-xs mb-2 ${r.badge}`}>{r.level} Risk</Badge>
                    <p className="text-xs font-semibold text-slate-700 mb-1">{r.stocks}</p>
                    <p className="text-xs text-slate-600">{r.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">过往表现不保证未来结果。所有投资均存在亏损风险。</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── STOCK DIRECTORY ── */}
      {activeTab === "stocks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="按名称、代码或行业搜索…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
            </div>
          </div>

          {/* Sector quick filters */}
          <div className="flex gap-2 flex-wrap">
            {["全部", "科技", "人工智能", "加密货币"].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSector(s === selectedSector ? "全部" : s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedSector === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400">{filteredStocks.length} 只股票</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStocks.map((stock, i) => (
              <motion.div key={stock.symbol} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <StockCard stock={stock} onClick={setSelectedStock} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── CHARTS ── */}
      {activeTab === "charts" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-500" /> 市值（十亿美元）— 前 10 大
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketCapChart />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" /> 营收增长 2020–2023（十亿美元）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueTrendChart />
                <div className="flex gap-4 mt-2 flex-wrap">
                  {[{c:"#6e6e73",l:"AAPL"},{c:"#00a1f1",l:"MSFT"},{c:"#76b900",l:"NVDA"},{c:"#ff9900",l:"AMZN"}].map(d => (
                    <span key={d.l} className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="w-3 h-1.5 rounded-full" style={{ background: d.c }} />{d.l}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-500" /> 投资组合质量因子（美国科技）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RiskRadarChart />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-500" /> 行业分布 — 已上市股票
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  {[
                    { name: "Technology (Pure)", pct: 60, color: "bg-indigo-500", count: 12 },
                    { name: "Communication / Media", pct: 15, color: "bg-cyan-500", count: 3 },
                    { name: "E-Commerce / Consumer", pct: 10, color: "bg-amber-500", count: 2 },
                    { name: "Fintech / Crypto", pct: 10, color: "bg-emerald-500", count: 2 },
                    { name: "AI Infrastructure", pct: 5, color: "bg-violet-500", count: 1 },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{s.name}</span>
                        <span className="font-medium">{s.count} stocks · {s.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <motion.div
                          className={`${s.color} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison table */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">巨型市值公司对比（前 6 大）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 text-slate-500 font-medium">股票</th>
                      <th className="text-right py-2 text-slate-500 font-medium">市值</th>
                      <th className="text-right py-2 text-slate-500 font-medium">营收</th>
                      <th className="text-right py-2 text-slate-500 font-medium">市盈率</th>
                      <th className="text-right py-2 text-slate-500 font-medium">风险</th>
                      <th className="text-right py-2 text-slate-500 font-medium">股息</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STOCKS.slice(0, 6).map((s, i) => (
                      <tr key={s.symbol} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedStock(s); }}>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{s.symbol}</span>
                            <span className="text-slate-400 hidden md:inline">{s.name.split(" ")[0]}</span>
                          </div>
                        </td>
                        <td className="text-right font-medium text-slate-700">{s.marketCap}</td>
                        <td className="text-right text-slate-600">{s.revenue.split(" ")[0]}</td>
                        <td className="text-right text-slate-600">{s.peRatio}</td>
                        <td className="text-right">
                          <Badge className={`text-xs px-1 ${s.badge}`}>{s.risk}</Badge>
                        </td>
                        <td className="text-right text-slate-600">{s.divYield}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Q&A ── */}
      {activeTab === "qa" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="relative h-40">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
                className="w-full h-full object-cover"
                alt="FAQ"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-blue-800/70 flex flex-col justify-center px-8">
                <HelpCircle className="w-8 h-8 text-white mb-2 opacity-80" />
                <h3 className="text-2xl font-bold text-white">常见问题解答</h3>
                <p className="text-blue-100 text-sm">了解 EVE FINANCE 美股交易的一切</p>
              </div>
            </div>
            <CardContent className="p-6">
              <QASection />
            </CardContent>
          </Card>

          {/* Risk disclaimer */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">投资风险披露</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    交易通证化股票涉及重大风险，包括可能损失全部投资。股价可能高度波动，受市场状况、公司业绩、经济因素和地缘政治事件影响。过往表现不代表未来结果。本指南仅供教育用途，不构成投资建议。请仅投资您能承受损失的资金，并考虑咨询持牌财务顾问。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stock Detail Modal */}
      <AnimatePresence>
        {selectedStock && (
          <StockDetail stock={selectedStock} onClose={() => setSelectedStock(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}