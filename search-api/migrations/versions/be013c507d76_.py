"""empty message

Revision ID: be013c507d76
Revises: 4f8d9cf024c6
Create Date: 2022-06-03 16:18:06.176698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'be013c507d76'
down_revision = '4f8d9cf024c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('document_access_request',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('business_identifier', sa.String(length=10), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.Column('payment_status_code', sa.String(length=50), nullable=True),
    sa.Column('payment_id', sa.String(length=4096), nullable=True),
    sa.Column('payment_completion_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('submission_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('expiry_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('output_file_key', sa.String(length=100), nullable=True),
    sa.Column('submitter_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['submitter_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_access_request_business_identifier'), 'document_access_request', ['business_identifier'], unique=False)
    op.create_table('document',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('document_type', sa.String(length=30), nullable=True),
    sa.Column('document_key', sa.String(length=100), nullable=False),
    sa.Column('file_name', sa.String(length=100), nullable=True),
    sa.Column('file_key', sa.String(length=100), nullable=True),
    sa.Column('access_request_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['access_request_id'], ['document_access_request.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_document_type'), 'document', ['document_type'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_document_document_type'), table_name='document')
    op.drop_table('document')
    op.drop_index(op.f('ix_document_access_request_business_identifier'), table_name='document_access_request')
    op.drop_table('document_access_request')
    # ### end Alembic commands ###
