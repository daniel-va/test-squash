FROM nginx:mainline-alpine

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "--quiet", "--spider", "http://localhost:80"]

EXPOSE 80
