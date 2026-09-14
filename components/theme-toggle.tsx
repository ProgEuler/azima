"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === "dark";

	return (
		<Button
			aria-label="Toggle theme"
			size="icon-sm"
			variant="outline"
			onClick={() => setTheme(isDark ? "light" : "dark")}
		>
			{mounted && isDark ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}
