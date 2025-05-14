FROM grafana/k6:latest

# Copy your custom-built k6 binary (k6-custom) into the image,
# renaming it to 'k6' and placing it where the original k6 binary is.
COPY --chown=root:root ./k6-custom /usr/bin/k6

# Ensure it's executable
RUN chmod +x /usr/bin/k6