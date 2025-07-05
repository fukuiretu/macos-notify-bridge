# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the macos-notify-bridge project - a Deno-based HTTP server that provides macOS notification functionality using OSAScript.

## Current State

The repository contains:
- README.md with project documentation
- server.ts with the main HTTP server implementation
- deno.json for Deno configuration
- CLAUDE.md for AI assistant guidance

## Development Notes

This is a Deno-based HTTP server project:
- Uses Deno runtime with TypeScript
- Provides HTTP endpoints for macOS notifications
- Uses OSAScript for system integration
- No external dependencies beyond Deno standard library

When adding new features:
- Follow existing TypeScript patterns in server.ts
- Use Deno's built-in HTTP server capabilities
- Test macOS notification functionality manually
- Run server with: `deno run --allow-net --allow-run server.ts`